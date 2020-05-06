import { useState, useContext } from 'react'
import moment from 'moment'
import SettingsLayout from '../../../components/SettingsLayout'
import AppContext from '../../../contexts/AppContext'

export default function OrganizationPage ({ organizations, selectedOrg, users = [] }) {
  const org = organizations.find(o => o.id == selectedOrg)
  const [name, setName] = useState(org.name)
  const [changingName, setChangingName] = useState(false)
  const { user: loggedInUser } = useContext(AppContext)

  const admins = users.filter(m => m.role === 'admin')
  const loggedInUserIsAdmin = admins.find(a => a.id === loggedInUser.id)

  const onSubmitChangeName = (e) => {
    e.preventDefault()
    setChangingName(true)

    fetch(`/organizations/${selectedOrg}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setChangingName(false)
        window.location.reload()
      })
      .catch(e => {
        console.error(e)
        setChangingName(false)
        window.location.reload()
      })
  }

  const onInputName = (e) => {
    setName(e.target.value)
  }

  const renderWithPermissions = () => {
    return (
      <div className="mb-12">
        <h3 className="text-xl mb-4">Basic information</h3>
        <div>
          <form className="w-1/2 mt-1" onSubmit={onSubmitChangeName}>
            <label htmlFor="orgNameInput" className="block mb-2 text-sm font-medium leading-5 text-gray-700">Name</label>
            <div className="flex">
              <span className="mr-2 relative flex-1 rounded-md shadow-sm">
                <input id="orgNameInput" onInput={onInputName} className="form-input block w-full sm:text-sm sm:leading-5" defaultValue={org.name} required />
              </span>
              <span className="inline-block rounded-md shadow-sm sm:col-start-2">
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 bg-indigo-600 text-white hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo disabled:opacity-50" disabled={changingName}>
                  Change name
                </button>
              </span>
            </div>
          </form>
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium leading-5 text-gray-700">Created on</label>
          <span className="inline-block sm:text-sm sm:leading-5">{moment(org.createdAt).format('dddd MMMM Do YYYY hh:mm:ss a')}</span>
        </div>
      </div>
    )
  }

  const renderNoPermissions = () => {
    return (
      <div className="mb-12">
        <h3 className="text-xl mb-4">Basic information</h3>
        <div>
          <label className="block mb-1 text-sm font-medium leading-5 text-gray-700">Name</label>
          <span className="inline-block sm:text-sm sm:leading-5">{org.name}</span>
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium leading-5 text-gray-700">Created on</label>
          <span className="inline-block sm:text-sm sm:leading-5">{moment(org.createdAt).format('dddd MMMM Do YYYY hh:mm:ss a')}</span>
        </div>
      </div>
    )
  }

  return (
    <SettingsLayout
      active="orgs"
      organizations={organizations}
      selectedOrg={selectedOrg}
      featureFlags={org.featureFlags}
      selectedSection="basic"
    >
      { loggedInUserIsAdmin ? renderWithPermissions() : renderNoPermissions() }
    </SettingsLayout>
  )
}

export async function getServerSideProps ({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listOrgs, listUsers } = require('../../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)
  let users = await listUsers(params.id)

  return {
    props: {
      organizations,
      selectedOrg: params.id,
      users,
    },
  }
}
