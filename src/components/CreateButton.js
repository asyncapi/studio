import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Dropdown from './Dropdown'

export default function CreateButton () {
  const [open, setOpen] = useState(false)
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [createFileName, setCreateFileName] = useState()

  const onClickDownload = (template) => {
  }

  const onClickNewFile = () => {
    setShowNewFileModal(true)
  }

  const onClickCreateFile = async () => {
    // await createFile(createFileName)
    setShowNewFileModal(false)
  }

  return (
    <Dropdown title="Add" icon={<FaPlus className="text-md mt-1 mr-2" />}>
      <a href="/apis/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New AsyncAPI file</a>
      <a href="/apis/import" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Import AsyncAPI file</a>
      <a href="/projects/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New project</a>
      <a href="/orgs/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New organization</a>
    </Dropdown>
  )
}
