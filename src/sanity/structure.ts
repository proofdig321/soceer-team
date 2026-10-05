import { structureTool } from 'sanity/structure'
import { DocumentIcon } from '@sanity/icons/Document'
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { EmptyIcon } from '@sanity/icons/Empty'
import { apiVersion } from './env'
import { singleton } from './lib/builders'
import { pageDirectoriesListItem } from './lib/page-directories'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export default structureTool({
	structure: (S, context) =>
		S.list()
			.title('Structure')
			.items([
				S.divider().title('Global'),
				singleton(S, 'site').title('Site').icon(EarthGlobeIcon),
				S.documentTypeListItem('global-module').title('Global modules'),
				S.documentTypeListItem('skill').title('Skills'),

				S.divider().title('Pages'),
				S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
				pageDirectoriesListItem(S, context),

				S.divider().title('Blog'),
				S.documentTypeListItem('blog.post').title('Posts'),
				S.documentTypeListItem('blog.category').title('Categories'),

				S.divider().title('Navigation'),
				S.documentTypeListItem('navigation'),
				S.documentTypeListItem('redirect').title('Redirects'),

				S.divider().title('References'),
				S.documentTypeListItem('announcement').title('Announcements'),
				S.documentTypeListItem('form').title('Forms'),
				S.documentTypeListItem('logo').title('Logos'),
				S.documentTypeListItem('person').title('People'),
				S.documentTypeListItem('quote').title('Quotes'),

				S.divider().title('Club operations'),
				S.documentTypeListItem('sports.team').title('Teams'),
				S.documentTypeListItem('sports.player').title('Player profiles'),
				S.documentTypeListItem('sports.fixture').title('Fixtures and results'),

				S.divider().title('Programme operations'),
				S.documentTypeListItem('sports.pilot').title(
					'Team pilots and readiness',
				),
				S.documentTypeListItem('sports.training').title(
					'Training and capability sessions',
				),
				S.documentTypeListItem('sports.support').title(
					'Platform support queue',
				),

				S.divider().title('Competition operations'),
				S.documentTypeListItem('sports.competition').title(
					'Tournaments and leagues',
				),
				S.documentTypeListItem('sports.event').title(
					'Event delivery and readiness',
				),

				S.divider().title('Foundation stewardship'),
				S.documentTypeListItem('sports.stakeholder').title('Stakeholders'),
				S.documentTypeListItem('sports.customization').title(
					'Platform customisations',
				),
				S.documentTypeListItem('sports.governance').title('Governance drafts'),

				S.divider().title('Finance and partnerships'),
				S.documentTypeListItem('sports.commercial').title(
					'Commercial and sponsor agreements',
				),
				S.documentTypeListItem('sports.resource').title(
					'Programme resources and budget lines',
				),

				S.divider().title('Restricted pathways'),
				S.documentTypeListItem('sports.talent').title('Talent pathway reviews'),

				S.divider().title('Drafts'),
				S.listItem()
					.title('Drafts')
					.icon(EmptyIcon)
					.child(
						S.documentList()
							.title('Drafts')
							.apiVersion(apiVersion)
							.filter(
								'_originalId in path("drafts.**") && !(_type match "sanity.*")',
							),
					),
			]),
})
