import { useContext } from 'react'
import AppContext from '../contexts/AppContext'

export default function Index() {
  const { org } = useContext(AppContext)
  console.log(org)

  return (
    <div>
     Developer portal!
    </div>
  )
}
