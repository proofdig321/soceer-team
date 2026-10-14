#!/usr/bin/env node
/**
 * deploy-team.mjs — Deploy a fresh team instance
 *
 * Creates a new Sanity project, generates API tokens, creates a Vercel
 * project with all env vars set, and writes a .env.local ready for use.
 *
 * Requirements:
 *   SANITY_AUTH_TOKEN  — from https://www.sanity.io/manage → API tokens (personal)
 *   VERCEL_TOKEN       — from https://vercel.com/account/tokens
 *
 * Usage:
 *   node scripts/deploy-team.mjs --name "Riverside FC" --url "https://riversidefc.vercel.app"
 *
 * Optional:
 *   --dataset   Sanity dataset name (default: production)
 *   --team-id   Vercel team ID (default: personal account)
 *   --repo      GitHub repo to link e.g. "org/repo" (optional)
 */

import { createClient } from '@sanity/client'
import { writeFileSync } from 'fs'
import { createInterface } from 'readline'

function arg(flag) {
  const i = process.argv.indexOf(flag)
  return i !== -1 ? process.argv[i + 1] : null
}

async function ask(question, fallback) {
  if (fallback) return fallback
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(r => rl.question(`${question}: `, a => { rl.close(); r(a.trim()) }))
}

async function api(url, { method = 'GET', token, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text}`)
  return JSON.parse(text)
}

async function main() {
  console.log('\n┌─────────────────────────────────────────┐')
  console.log('│  Team Deployment — Civic Sports Platform │')
  console.log('└─────────────────────────────────────────┘\n')

  // ── Config ──────────────────────────────────────────────────────────────
  const SANITY_AUTH = process.env.SANITY_AUTH_TOKEN
  const VERCEL_TOK  = process.env.VERCEL_TOKEN

  if (!SANITY_AUTH) throw new Error('Set SANITY_AUTH_TOKEN (personal token from sanity.io/manage)')
  if (!VERCEL_TOK)  throw new Error('Set VERCEL_TOKEN (from vercel.com/account/tokens)')

  const teamName  = await ask('Team name (e.g. "Riverside FC")',          arg('--name'))
  const baseUrl   = await ask('Production URL (e.g. https://x.vercel.app)', arg('--url'))
  const dataset   = arg('--dataset') || 'production'
  const vercelTeam = arg('--team-id') || ''
  const repo      = arg('--repo') || ''

  const slug = teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // ── 1. Create Sanity project ─────────────────────────────────────────────
  console.log('\n[1/4] Creating Sanity project...')

  const project = await api('https://api.sanity.io/v2021-06-07/projects', {
    method: 'POST',
    token: SANITY_AUTH,
    body: { displayName: teamName },
  })
  const projectId = project.id
  console.log(`  ✓ Project: ${projectId}`)

  // Create dataset
  await api(`https://api.sanity.io/v2021-06-07/projects/${projectId}/datasets/${dataset}`, {
    method: 'PUT',
    token: SANITY_AUTH,
    body: { aclMode: 'public' },
  })
  console.log(`  ✓ Dataset: ${dataset}`)

  // Add CORS for localhost dev + production
  for (const origin of ['http://localhost:3000', baseUrl]) {
    await api(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
      method: 'POST',
      token: SANITY_AUTH,
      body: { origin, allowCredentials: true },
    }).catch(() => {}) // ignore if already exists
  }
  console.log(`  ✓ CORS: localhost:3000 + ${baseUrl}`)

  // ── 2. Create API tokens ─────────────────────────────────────────────────
  console.log('\n[2/4] Creating API tokens...')

  const [readTokenData, writeTokenData] = await Promise.all([
    api(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`, {
      method: 'POST', token: SANITY_AUTH,
      body: { label: 'Read token', roleName: 'viewer' },
    }),
    api(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`, {
      method: 'POST', token: SANITY_AUTH,
      body: { label: 'Write token', roleName: 'editor' },
    }),
  ])

  const readToken  = readTokenData.key
  const writeToken = writeTokenData.key
  console.log('  ✓ Read token')
  console.log('  ✓ Write token')

  // ── 3. Create Vercel project ─────────────────────────────────────────────
  console.log('\n[3/4] Creating Vercel project...')

  const teamParam = vercelTeam ? `?teamId=${vercelTeam}` : ''

  const envVars = [
    { key: 'NEXT_PUBLIC_BASE_URL',          value: baseUrl,    target: ['production', 'preview', 'development'], type: 'plain' },
    { key: 'NEXT_PUBLIC_SANITY_PROJECT_ID', value: projectId,  target: ['production', 'preview', 'development'], type: 'plain' },
    { key: 'NEXT_PUBLIC_SANITY_DATASET',    value: dataset,    target: ['production', 'preview', 'development'], type: 'plain' },
    { key: 'SANITY_API_READ_TOKEN',         value: readToken,  target: ['production', 'preview', 'development'], type: 'encrypted' },
    { key: 'SANITY_API_WRITE_TOKEN',        value: writeToken, target: ['production', 'preview', 'development'], type: 'encrypted' },
  ]

  const vercelBody = {
    name: slug,
    framework: 'nextjs',
    environmentVariables: envVars,
  }

  // Link GitHub repo if provided
  if (repo) {
    const [repoOwner, repoName] = repo.split('/')
    vercelBody.gitRepository = { type: 'github', repo: `${repoOwner}/${repoName}` }
  }

  const vercelProject = await api(`https://api.vercel.com/v9/projects${teamParam}`, {
    method: 'POST', token: VERCEL_TOK, body: vercelBody,
  })
  console.log(`  ✓ Vercel project: ${vercelProject.name} (${vercelProject.id})`)

  // ── 4. Write .env.local ──────────────────────────────────────────────────
  console.log('\n[4/4] Writing .env.local...')

  const envContent = `# ${teamName} — generated ${new Date().toISOString()}

NEXT_PUBLIC_BASE_URL=${baseUrl}

NEXT_PUBLIC_SANITY_PROJECT_ID=${projectId}
NEXT_PUBLIC_SANITY_DATASET=${dataset}

SANITY_API_READ_TOKEN=${readToken}
SANITY_API_WRITE_TOKEN=${writeToken}

VERCEL_TOKEN=${VERCEL_TOK}
`
  writeFileSync('.env.local', envContent)
  console.log('  ✓ .env.local written')

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log('\n┌─────────────────────────────────────────┐')
  console.log('│  Done                                    │')
  console.log('└─────────────────────────────────────────┘')
  console.log(`
  Sanity Studio : ${baseUrl}/admin
  Manage        : https://sanity.io/manage/project/${projectId}
  Vercel        : https://vercel.com/dashboard
  
  Next steps:
  1. Push this repo to GitHub (if not already)
  2. In Vercel dashboard → connect "${slug}" project to your GitHub repo
  3. Vercel deploys automatically on push
  4. Open ${baseUrl}/admin → create site + page (slug: index) docs
`)
}

main().catch(err => { console.error('\n✗', err.message); process.exitCode = 1 })
