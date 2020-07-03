import EditorLayout from '../components/EditorLayout'
import Editor from '../components/Editor'

export default function Index ({ initialAPI, projects }) {
  return (
    <EditorLayout>
      <Editor
        projects={projects}
        initialAPI={initialAPI}
        />
    </EditorLayout>
  )
}

export async function getServerSideProps({ req }) {
  let projects = null
  if (req.userPublicInfo) {
    const { list: listProjects } = require('../handlers/projects')
    projects = await listProjects(req.userPublicInfo.id)
  }

  let initialAPI = null
  if (req.query.import) {
    const importUrl = req.query.import
    if (importUrl) {
      try {
        const response = await fetch(importUrl, {
          mode: 'no-cors',
          redirect: 'follow',
        })
        if (!response.ok) {
          console.error(response)
          throw new Error(response.statusText)
        }
        const content = await response.text()
        initialAPI = {
          title: importUrl,
          asyncapi: content,
          anonymous: true,
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  return {
    props: {
      projects,
      initialAPI,
    },
  }
}
