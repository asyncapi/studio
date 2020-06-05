import DirectoryLayout from '../components/DirectoryLayout'

export default function Directory ({ orgs = [], selectedOrg, projects = [], selectedProject, apis = [] }) {
  const truncate = text => {
    const limit = 100
    if (text && text.length > limit) return `${text.substr(0, limit)}...`
    return text
  }

  if (!apis.length) {
    return (
      <DirectoryLayout
        title="Directory"
        page="directory"
        orgs={orgs}
        selectedOrg={selectedOrg}
        projects={projects}
        selectedProject={selectedProject}
      >
        <div className="mx-auto md:w-1/4">
          <img src="/img/empty-states/no-apis.png" alt="There are no APIs to show" className="w-full block" />
          <h2 className="text-2xl text-gray-600 text-center">There are no async APIs to show</h2>
          <p className="mt-2 mb-2 text-sm text-gray-400 text-center">Try changing the filters above or creating a new async API now.</p>
          <a href="/apis/new" className="block w-full mt-4 text-center rounded-md shadow-sm px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
            Create an async API now
          </a>
        </div>
      </DirectoryLayout>
    )
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
          <a key={api.id} href={`/apis/${api.id}`} className="block min-w-1/4 w-1/4 p-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div style={{backgroundImage: "url('/img/api-bg.png')", backgroundSize: 'cover'}} className="flex px-4 py-5 border-b border-gray-100 sm:px-6">
                <h3 className="flex-1 text-lg leading-6 font-medium text-gray-900 truncate" title={api.title}>
                  {api.title}
                </h3>
                <span className="ml-3 bg-indigo-200 px-2 py-1 text-xs rounded bg-indigo-400 text-white" title={`Version: ${api.version}`}>{api.version}</span>
              </div>
              <div className="h-24 px-4 py-5 sm:px-6 text-gray-400">
                <p className="h-16 text-gray-600 text-sm overflow-hidden" title={api.computedAsyncapi.info.description}>
                  {truncate(api.computedAsyncapi.info.description) || (<span className="italic text-gray-400">(No description)</span>)}
                </p>
              </div>
              <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
                <div className="flex text-xs text-gray-400">
                  <span className="max-w-1/2 truncate overflow-hidden" title={api.project.organization.name}>{api.project.organization.name}</span>
                  <span className="ml-1 mr-1">/</span>
                  <span className="max-w-1/2 truncate overflow-hidden" title={api.project.name}>{api.project.name}</span>
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
  if (!req.userPublicInfo) return { props: {} }

  const { list:listOrgs } = require('../handlers/orgs')
  const { list:listProjects } = require('../handlers/projects')
  const { list:listAPIs } = require('../handlers/apis')

  const orgs = await listOrgs(req.userPublicInfo.id)
  let selectedOrg = null
  if (req.query.org) selectedOrg = orgs.find(o => o.id === Number(req.query.org)) || null

  const projects = await listProjects(req.userPublicInfo.id, {
    org: Number(req.query.org) || undefined,
  })

  let selectedProject = null
  if (req.query.project) selectedProject = projects.find(p => p.id === Number(req.query.project)) || null

  const apis = await listAPIs(req.userPublicInfo.id, {
    org: Number(req.query.org) || undefined,
    projectId: Number(req.query.project) || undefined,
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
