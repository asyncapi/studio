import { useState, useContext, useEffect } from 'react'
import debounce from 'lodash/debounce'
import SettingsLayout from '../../../../components/SettingsLayout'
import AppContext from '../../../../contexts/AppContext'

export default function OrganizationPage({ organizations, selectedOrg, users = [] }) {
  const org = organizations.find(o => o.id == selectedOrg)
  const [slug, setSlug] = useState(org.slug)
  const [changingSlug, setChangingSlug] = useState(false)
  const [checkStatus, setCheckStatus] = useState()
  const { user: loggedInUser } = useContext(AppContext)

  const admins = users.filter(m => m.role === 'admin')
  const loggedInUserIsAdmin = admins.find(a => a.id === loggedInUser.id)

  const onSubmitChangeName = (e) => {
    e.preventDefault()
    setChangingSlug(true)

    fetch(`/organizations/${selectedOrg}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setChangingSlug(false)
        window.location.reload()
      })
      .catch(e => {
        console.error(e)
        setChangingSlug(false)
        window.location.reload()
      })
  }

  const onInputSlug = (value) => {
    setSlug(value)
  }
  const debouncedOnInputSlug = debounce(onInputSlug, 500)

  useEffect(() => {
    const checkExistence = async () => {
      try {
        setCheckStatus()
        const res = await fetch(`/organizations?slug=${slug}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        })
        if (res.status === 404) {
          return setCheckStatus('ok')
        }
        const organization = await res.json()
        if (organization.slug !== org.slug) {
          setCheckStatus('bad')
        }
      } catch (e) {
        console.error(e)
      }
    }

    checkExistence()
  }, [slug])

  return (
    <SettingsLayout
      active="orgs"
      organizations={organizations}
      selectedOrg={selectedOrg}
      selectedSection="developer-portal"
    >
      <h3 className="text-xl mb-4">Developer portal</h3>
      <form className="w-1/2 mt-1" onSubmit={onSubmitChangeName}>
        <label htmlFor="orgSlugInput" className="block mb-2 text-sm font-medium leading-5 text-gray-700">Slug</label>
        <div className="flex">
          <span className="mr-2 relative flex-1 rounded-md shadow-sm">
            <input id="orgSlugInput" onInput={e => debouncedOnInputSlug(e.target.value)} className="form-input block w-full sm:text-sm sm:leading-5" defaultValue={org.slug} required />
          </span>
          <span className="inline-block rounded-md shadow-sm sm:col-start-2">
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 bg-indigo-600 text-white hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo disabled:opacity-50" disabled={changingSlug || checkStatus === 'bad'}>
              Change slug
            </button>
          </span>
        </div>
        { checkStatus === 'ok' && (
          <div className="text-green-500 text-sm mt-2">This is a great slug 👌</div>
        ) }
        { checkStatus === 'bad' && (
          <div className="text-red-500 text-sm mt-2">This slug is already taken. Choose a different one.</div>
        ) }
      </form>
    </SettingsLayout>
  )
}

export async function getServerSideProps({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listOrgs, listUsers } = require('../../../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)
  let users = await listUsers(params.id)
  users = users.map(user => formatUser(user))

  const { list: listInvitations } = require('../../../../handlers/invitations')
  const invitations = await listInvitations(params.id, req.userPublicInfo.id)

  return {
    props: {
      organizations,
      selectedOrg: params.id,
      invitations,
      users,
    },
  }
}

function formatUser(user) {
  const result = user

  result.displayName = result.displayName
  delete result.displayName
  result.joinedOrganizationAt = result.joined_organization_at
  delete result.joined_organization_at

  const {
    id,
    avatar,
    displayName,
    email,
    joinedOrganizationAt,
    role,
  } = result

  return {
    id,
    avatar,
    displayName,
    email,
    joinedOrganizationAt,
    role,
  }
}
