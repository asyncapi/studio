import Markdown from 'react-markdown-it'
import DirectoryLayout from '../components/DirectoryLayout'

export default function Directory ({ notLoggedIn = false, orgs = [], selectedOrg, projects = [], selectedProject, apis = [] }) {
  if (notLoggedIn) {
    return <DirectoryLayout notLoggedIn={true} />
  }

  return (
    <DirectoryLayout
      title="Directory"
      page="directory"
      orgs={orgs}
      selectedOrg={selectedOrg}
      projects={projects}
      selectedProject={selectedProject}
    >
      <div className="flex flex-wrap">
      {
        apis.map(api => (
          <a key={api.id} href={`/?api=${api.id}`} className="block min-w-1/4 w-1/4 p-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {api.title} <span className="text-sm text-gray-400">{api.version}</span>
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                  {api.url}
                </p>
              </div>
              <div className="h-32 px-4 py-5 sm:px-6 text-gray-400">
                <div className="h-24 overflow-hidden">
                  <Markdown source={api.computed_asyncapi.info.description || '_(No description)_'} />
                </div>
              </div>
            </div>
          </a>
        ))
      }
      </div>
    </DirectoryLayout>
  )
}

export async function getServerSideProps ({ req }) {
  if (!req.userPublicInfo) return { props: { notLoggedIn: true } }

  const { list:listOrgs } = require('../handlers/orgs')
  const { list:listProjects } = require('../handlers/projects')
  const { list:listAPIs } = require('../handlers/apis')

  const orgs = await listOrgs(req.userPublicInfo.id)
  let selectedOrg = null
  if (req.query.org) selectedOrg = orgs.find(o => o.id === Number(req.query.org)) || null

  const projects = await listProjects(req.userPublicInfo.id, {
    org: req.query.org,
  })

  let selectedProject = null
  if (req.query.project) selectedProject = projects.find(p => p.id === Number(req.query.project)) || null

  const apis = await listAPIs(req.userPublicInfo.id, {
    org: req.query.org,
    project: req.query.project,
  })

  const data = {
    orgs,
    projects,
    apis,
    selectedOrg,
    selectedProject,
  }

  return {
    props: data,
  }
}
