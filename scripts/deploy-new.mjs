#!/usr/bin/env node
/**
 * deploy-new.mjs — Automated new deployment
 *
 * Creates a fresh Sanity project + dataset, links a new Vercel project,
 * uploads logo assets, seeds all content, and writes a ready .env file.
 *
 * Prerequisites:
 *   npm install -g @sanity/cli vercel
 *   sanity login
 *   vercel login
 *
 * Usage:
 *   node scripts/deploy-new.mjs \
 *     --name "My Sports Club" \
 *     --domain "mysportsclub.vercel.app" \
 *     --org-id "your-vercel-org-id"
 *
 * Or interactively (prompts for missing values):
 *   node scripts/deploy-new.mjs
 */

import { execSync, spawnSync } from 'child_process'
import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ─── CLI args ─────────────────────────────────────────────────────────────────

function arg(flag) {
  const i = process.argv.indexOf(flag)
  return i !== -1 ? process.argv[i + 1] : null
}

async function prompt(question, fallback) {
  if (fallback) return fallback
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(`${question}: `, ans => { rl.close(); resolve(ans.trim()) }))
}

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`)
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: opts.silent ? 'pipe' : 'inherit', ...opts })
}

function runCapture(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim()
}

// ─── Step 1: Gather config ────────────────────────────────────────────────────

async function gatherConfig() {
  console.log('\n── Deployment Configuration ──────────────────────────────────\n')

  const siteName   = await prompt('Site name (e.g. "Riverside FC")',       arg('--name'))
  const dataset    = await prompt('Sanity dataset name',                    arg('--dataset') || 'production')
  const baseUrl    = await prompt('Production URL (e.g. https://myclub.vercel.app)', arg('--domain'))
  const orgId      = await prompt('Vercel org/team ID (leave blank for personal)', arg('--org-id') || '')

  return { siteName, dataset, baseUrl, orgId }
}

// ─── Step 2: Create Sanity project ───────────────────────────────────────────

async function createSanityProject(siteName, dataset) {
  console.log('\n── Creating Sanity project ────────────────────────────────────\n')

  // Use Sanity Management API via CLI
  const result = runCapture(
    `npx sanity projects create --name "${siteName}" --output json 2>/dev/null || echo ""`
  )

  let projectId
  try {
    const parsed = JSON.parse(result)
    projectId = parsed.id || parsed.projectId
  } catch {
    // CLI may not support --output json on all versions — fall back to interactive
    console.log('  Could not auto-create project. Creating via API...')
    projectId = await createProjectViaAPI(siteName)
  }

  if (!projectId) throw new Error('Failed to get Sanity project ID')
  console.log(`  ✓ Project ID: ${projectId}`)

  // Create dataset
  run(`npx sanity datasets create ${dataset} --visibility public`, { silent: true })
  console.log(`  ✓ Dataset: ${dataset}`)

  return projectId
}

async function createProjectViaAPI(displayName) {
  // Requires SANITY_AUTH_TOKEN or active sanity login session
  const token = process.env.SANITY_AUTH_TOKEN || runCapture('npx sanity debug --secrets 2>/dev/null | grep authToken | head -1 | awk \'{print $2}\'').trim()

  const res = await fetch('https://api.sanity.io/v2021-06-07/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ displayName }),
  })
  if (!res.ok) throw new Error(`Sanity API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.id
}

// ─── Step 3: Create Sanity API tokens ────────────────────────────────────────

async function createSanityTokens(projectId) {
  console.log('\n── Creating Sanity API tokens ─────────────────────────────────\n')

  const authToken = process.env.SANITY_AUTH_TOKEN || runCapture(
    'npx sanity debug --secrets 2>/dev/null | grep authToken | head -1 | awk \'{print $2}\''
  ).trim()

  async function createToken(label, roleName) {
    const res = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ label, roleName }),
    })
    if (!res.ok) throw new Error(`Token creation failed: ${res.status} ${await res.text()}`)
    const data = await res.json()
    return data.key
  }

  const readToken  = await createToken('Read token',  'viewer')
  const writeToken = await createToken('Write token', 'editor')

  console.log('  ✓ Read token created')
  console.log('  ✓ Write token created')

  return { readToken, writeToken }
}

// ─── Step 4: Upload logo assets ──────────────────────────────────────────────

async function uploadAssets(projectId, dataset, writeToken) {
  console.log('\n── Uploading logo assets ──────────────────────────────────────\n')

  const client = createClient({
    projectId, dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: writeToken,
  })

  const assets = [
    { file: 'public/unami-sports-wordmark.webp', label: 'SPORTS_LOGO' },
    { file: 'public/unami-stars-wordmark.webp',  label: 'STARS_LOGO' },
    { file: 'public/og-image.png',               label: 'OG_IMAGE' },
  ]

  const refs = {}

  for (const { file, label } of assets) {
    const filePath = resolve(ROOT, file)
    if (!existsSync(filePath)) {
      console.log(`  ⚠ ${file} not found — skipping ${label}`)
      refs[label] = null
      continue
    }
    const buffer = readFileSync(filePath)
    const ext = file.split('.').pop()
    const mimeTypes = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg' }
    const asset = await client.assets.upload('image', buffer, {
      filename: file.split('/').pop(),
      contentType: mimeTypes[ext] || 'image/webp',
    })
    refs[label] = asset._id.replace('image-', '').replace(/-[a-z]+$/, '') + '-' + asset._id.split('-').pop()
    // Store the full asset ref as Sanity uses it
    refs[label] = asset._id
    console.log(`  ✓ ${label}: ${asset._id}`)
  }

  return refs
}

// ─── Step 5: Seed content ─────────────────────────────────────────────────────

async function seedContent(projectId, dataset, writeToken, assetRefs, siteName, baseUrl) {
  console.log('\n── Seeding content ────────────────────────────────────────────\n')

  // Read seed.mjs and patch the project/asset refs
  let seedSrc = readFileSync(resolve(ROOT, 'scripts/seed.mjs'), 'utf8')

  // Patch hardcoded project ID
  seedSrc = seedSrc.replace(/projectId: '[^']*'/, `projectId: '${projectId}'`)
  seedSrc = seedSrc.replace(/dataset: '[^']*'/, `dataset: '${dataset}'`)

  // Patch asset refs if we uploaded new ones
  if (assetRefs.SPORTS_LOGO) {
    seedSrc = seedSrc.replace(/const SPORTS_LOGO = '[^']*'/, `const SPORTS_LOGO = '${assetRefs.SPORTS_LOGO}'`)
  }
  if (assetRefs.STARS_LOGO) {
    seedSrc = seedSrc.replace(/const STARS_LOGO  = '[^']*'/, `const STARS_LOGO  = '${assetRefs.STARS_LOGO}'`)
  }
  if (assetRefs.OG_IMAGE) {
    seedSrc = seedSrc.replace(/const OG_IMAGE    = '[^']*'/, `const OG_IMAGE    = '${assetRefs.OG_IMAGE}'`)
  }

  // Patch site title
  seedSrc = seedSrc.replace(
    /title: 'Unami Sports'/,
    `title: '${siteName}'`
  )

  // Write temp seed file
  const tmpSeed = resolve(ROOT, 'scripts/_deploy-seed.mjs')
  writeFileSync(tmpSeed, seedSrc)

  // Run it
  execSync(`SANITY_API_WRITE_TOKEN=${writeToken} NEXT_PUBLIC_BASE_URL=${baseUrl} node scripts/_deploy-seed.mjs`, {
    cwd: ROOT, stdio: 'inherit',
  })

  // Clean up
  execSync(`rm ${tmpSeed}`, { cwd: ROOT })
  console.log('  ✓ Content seeded')
}

// ─── Step 6: Create Vercel project ───────────────────────────────────────────

async function createVercelProject(siteName, projectId, dataset, readToken, writeToken, baseUrl, orgId) {
  console.log('\n── Creating Vercel project ────────────────────────────────────\n')

  const vercelToken = process.env.VERCEL_TOKEN || runCapture('cat ~/.vercel/auth.json 2>/dev/null | node -e "process.stdin.resume();let d=\'\';process.stdin.on(\'data\',c=>d+=c);process.stdin.on(\'end\',()=>console.log(JSON.parse(d).token||\'\')" 2>/dev/null').trim()

  if (!vercelToken) {
    console.log('  ⚠ No Vercel token found. Run `vercel login` first, or set VERCEL_TOKEN env var.')
    console.log('  Skipping Vercel project creation — set env vars manually.')
    return null
  }

  const projectSlug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const body = {
    name: projectSlug,
    framework: 'nextjs',
    environmentVariables: [
      { key: 'NEXT_PUBLIC_BASE_URL',          value: baseUrl,    target: ['production', 'preview'], type: 'plain' },
      { key: 'NEXT_PUBLIC_SANITY_PROJECT_ID', value: projectId,  target: ['production', 'preview'], type: 'plain' },
      { key: 'NEXT_PUBLIC_SANITY_DATASET',    value: dataset,    target: ['production', 'preview'], type: 'plain' },
      { key: 'SANITY_API_READ_TOKEN',         value: readToken,  target: ['production', 'preview'], type: 'encrypted' },
      { key: 'SANITY_API_WRITE_TOKEN',        value: writeToken, target: ['production', 'preview'], type: 'encrypted' },
    ],
  }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${vercelToken}` }
  const teamParam = orgId ? `?teamId=${orgId}` : ''

  const res = await fetch(`https://api.vercel.com/v9/projects${teamParam}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.log(`  ⚠ Vercel project creation failed: ${err}`)
    return null
  }

  const project = await res.json()
  console.log(`  ✓ Vercel project: ${project.name} (${project.id})`)

  // Add CORS origin to Sanity project
  const authToken = process.env.SANITY_AUTH_TOKEN
  if (authToken && baseUrl) {
    await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ origin: baseUrl, allowCredentials: true }),
    }).catch(() => {})
    console.log(`  ✓ CORS origin added: ${baseUrl}`)
  }

  return project
}

// ─── Step 7: Write .env file ──────────────────────────────────────────────────

function writeEnvFile(projectId, dataset, readToken, writeToken, baseUrl) {
  const envPath = resolve(ROOT, '.env.deploy')
  const content = `# Generated by deploy-new.mjs — ${new Date().toISOString()}
# Copy this to .env.local for local development against the new project

NEXT_PUBLIC_BASE_URL=${baseUrl}

NEXT_PUBLIC_SANITY_PROJECT_ID=${projectId}
NEXT_PUBLIC_SANITY_DATASET=${dataset}

SANITY_API_READ_TOKEN=${readToken}
SANITY_API_WRITE_TOKEN=${writeToken}
`
  writeFileSync(envPath, content)
  console.log(`\n  ✓ Env vars written to .env.deploy`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  Unami Sports — Automated New Deployment                     ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')

  const { siteName, dataset, baseUrl, orgId } = await gatherConfig()

  const projectId              = await createSanityProject(siteName, dataset)
  const { readToken, writeToken } = await createSanityTokens(projectId)
  const assetRefs              = await uploadAssets(projectId, dataset, writeToken)

  await seedContent(projectId, dataset, writeToken, assetRefs, siteName, baseUrl)

  const vercelProject = await createVercelProject(
    siteName, projectId, dataset, readToken, writeToken, baseUrl, orgId
  )

  writeEnvFile(projectId, dataset, readToken, writeToken, baseUrl)

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  Deployment ready                                            ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')
  console.log(`  Sanity project : https://sanity.io/manage/project/${projectId}`)
  console.log(`  Sanity Studio  : ${baseUrl}/admin`)
  if (vercelProject) {
    console.log(`  Vercel project : https://vercel.com/dashboard/${vercelProject.name}`)
  }
  console.log(`  Env file       : .env.deploy`)
  console.log('\n  Next steps:')
  console.log('  1. Push this repo to GitHub')
  console.log('  2. Connect the Vercel project to your GitHub repo')
  console.log('  3. Vercel will build and deploy automatically')
  console.log('  4. Publish the site + page (slug: index) docs in Sanity Studio\n')
}

main().catch(err => { console.error('\n✗', err.message); process.exitCode = 1 })
