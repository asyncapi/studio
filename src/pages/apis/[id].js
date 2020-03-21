import EditorLayout from '../../components/EditorLayout'
import Editor from '../../components/Editor'

export default function ApiPage ({ initialAPI, projects }) {
  return (
    <EditorLayout>
      <Editor
        initialAPI={initialAPI}
        projects={projects}
        />
    </EditorLayout>
  )
}

export async function getServerSideProps({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listProjects } = require('../../handlers/projects')
  const projects = await listProjects(req.userPublicInfo.id)

  if (!params.id) {
    return {
      props: {
        projects,
      }
    }
  }

  const { get: getAPI } = require('../../handlers/apis')
  const initialAPI = await getAPI(Number(params.id), req.userPublicInfo.id)

  return {
    props: {
      initialAPI,
      projects,
    },
  }
}
