import AppLayout from '../../components/AppLayout'

export default function CreateAPI ({ projects = [] }) {
  return (
    <AppLayout
      title="New API"
      page="directory"
    >
      <form method="POST" className="mx-auto md:w-2/4">
        <h2 className="text-black text-4xl">Add a new API</h2>
        <div className="flex mt-4">
          <div className="flex-1 mr-2">
            <label className="block text-sm font-medium leading-5 text-gray-700">Organization / Project</label>
            <select name="project" className="form-select mt-2 relative block w-full rounded-md bg-transparent focus:z-10 transition ease-in-out duration-150 sm:text-sm sm:leading-5" aria-label="Project">
              <option value="-1" selected>No project</option>
              {
                projects.map(project => (
                  <option key={project.id} value={project.id}>{project.org_name} / {project.name}</option>
                ))
              }
            </select>
          </div>
          <div className="flex-1 ml-2">
            <label className="block text-sm font-medium leading-5 text-gray-700">Name of the API</label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <input type="text" name="name" className="form-input block w-full sm:text-sm sm:leading-5" placeholder="e.g. Product, Customer, ..." required />
            </div>
          </div>
        </div>
        <button type="submit" className="block w-full mt-4 text-center rounded-md shadow-sm px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
          Create
        </button>
      </form>
    </AppLayout>
  )
}

export async function getServerSideProps ({ req }) {
  const { list:listProjects } = require('../../handlers/projects')

  const projects = await listProjects(req.userPublicInfo.id)

  const props = {
    projects,
  }

  return {
    props,
  }
}
