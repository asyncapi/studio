import { useState } from 'react'
import Head from 'next/head'
import moment from 'moment'
import { FaUserAlt, FaUsers, FaUserCog, FaRegCalendarAlt } from 'react-icons/fa'
import getRoleNiceName from './helpers/get-role-nice-name'

export default function Invite ({ invitations = [], onRemoveInvitation = () => {} }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const [showCopied, setShowCopied] = useState(false)

  const onClickRemoveLink = (id) => {
    fetch(`/invitations/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        onRemoveInvitation(id)
      })
      .catch(console.error)
  }

  const onCopy = (e, uuid) => {
    e.preventDefault()
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", `${origin}/${uuid}`)
      setShowCopied(true)
      setTimeout(() => { setShowCopied(false) }, 2000)
    }
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@3.7.2/animate.min.css" />
      </Head>
      <div>
        { invitations.map((invitation, index) => (
          <div key={index} className="block mb-4 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="flex px-4 py-4 sm:px-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
              <div className="flex-1">
                <div>
                  <span onCopy={e => { onCopy(e, invitation.uuid) }} onClick={() => { document.execCommand('copy') }} className="text-sm leading-5 font-medium text-indigo-600 truncate">
                    {origin}/{invitation.uuid}
                  </span>
                  <span className={`ml-2 text-gray-600 text-sm select-none ${showCopied ? 'inline-block animated tada' : 'hidden'}`}>Copied!</span>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="mr-6 flex items-center text-sm leading-5 text-gray-500">
                    { invitation.scope === 'one' && (
                      <>
                        <FaUserAlt className="mr-2" />
                        Single use
                      </>
                    ) }
                    { invitation.scope === 'multiple' && (
                      <>
                        <FaUsers className="mr-2" />
                        Multiple uses
                      </>
                    ) }
                  </div>
                  <div className="mt-2 mr-6 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
                    <FaUserCog className="mr-2" />
                    {getRoleNiceName(invitation.role)}
                  </div>
                  <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
                    <FaRegCalendarAlt className="mr-2" />
                    <span>
                      Expires on
                      <time dateTime={invitation.expiresAt} className="ml-1">{moment(invitation.expiresAt).format('MMMM Do YYYY')}</time>
                    </span>
                  </div>
                </div>
              </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="inline-block rounded-md shadow-sm sm:col-start-2">
                  <button onClick={() => onClickRemoveLink(invitation.id)} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 bg-transparent text-red-500 hover:bg-red-500 hover:text-white focus:border-red-700 focus:shadow-outline-red">
                    Remove
                  </button>
                </span>
              </div>
            </div>
          </div>
        )) }
      </div>
    </>
  )
}

function getScopeNiceName (scope) {
  switch (scope) {
    case 'one':
      return 'a single person'
    case 'multiple':
      return 'multiple people'
  }
}

function getExpirationNiceName (expiration) {
  switch (expiration) {
    case '1d':
      return '1 day'
    case '1w':
      return '1 week'
  }
}
