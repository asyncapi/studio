import EditorLayout from '../components/EditorLayout'
import Editor from '../components/Editor'

export default function Index ({ projects }) {
  return (
    <EditorLayout>
      <Editor
        projects={projects}
        />
    </EditorLayout>
  )
}

export async function getServerSideProps({ req }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listProjects } = require('../handlers/projects')
  const projects = await listProjects(req.userPublicInfo.id)

  return {
    props: {
      projects,
    },
  }
}
