import { useState, useEffect } from 'react'
import Head from 'next/head'
import { v4 as uuidV4 } from 'uuid'
import Dropdown from './Dropdown'
import getRoleNiceName from './helpers/get-role-nice-name'

export default function Invite ({ organization, onInvite = () => {} }) {
  const [role, setRole] = useState('member')
  const [scope, setScope] = useState('one')
  const [expiration, setExpiration] = useState('1d')
  const [linkUrl, setLinkUrl] = useState()
  const [showCopied, setShowCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const onCopy = (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", linkUrl);
      setShowCopied(true)
      setTimeout(() => { setShowCopied(false) }, 2000)
    }
  }

  const onClickGenerateLink = () => {
    const uuid = uuidV4()

    fetch(`/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orgId: organization.id,
        uuid,
        role,
        scope,
        expiration,
      }),
    })
      .then(res => res.json())
      .then((invitation) => {
        const uuid = invitation.uuid
        onInvite(invitation)
        setLinkUrl(`${origin}/${uuid}`)
      })
      .catch(console.error)

  }

  useEffect(() => {
    setLinkUrl()
  }, [role, scope, expiration])

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@3.7.2/animate.min.css" />
      </Head>
      <div>
        <span className="mr-1 text-gray-500">Generate a link for</span>
        <span className="inline-block relative rounded-md shadow-sm">
          <Dropdown
            title={getScopeNiceName(scope)}
            buttonHoverClassName="hover:text-black focus:text-black"
            align="left"
          >
            <a onClick={() => setScope('one')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getScopeNiceName('one')}</a>
            <a onClick={() => setScope('multiple')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getScopeNiceName('multiple')}</a>
          </Dropdown>
        </span>
        <span className="ml-1 mr-1 text-gray-500">to join as</span>
        <span className="inline-block relative rounded-md shadow-sm">
          <Dropdown
            title={getRoleNiceName(role).toLowerCase()}
            buttonHoverClassName="hover:text-black focus:text-black"
            align="left"
          >
            <a onClick={() => setRole('member')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getRoleNiceName('member').toLowerCase()}</a>
            <a onClick={() => setRole('admin')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getRoleNiceName('admin').toLowerCase()}</a>
          </Dropdown>
        </span>
      </div>
      <span className="mr-1 text-gray-500">The link must expire in</span>
      <span className="inline-block mr-2 relative rounded-md shadow-sm">
        <Dropdown
          title={getExpirationNiceName(expiration)}
          buttonHoverClassName="hover:text-black focus:text-black"
          align="left"
        >
          <a onClick={() => setExpiration('1d')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getExpirationNiceName('1d')}</a>
          <a onClick={() => setExpiration('1w')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{getExpirationNiceName('1w')}</a>
        </Dropdown>
      </span>
      { origin && (
        <div>
          { linkUrl && (
            <div>
              <input type="text" onCopy={onCopy} onClick={() => { document.execCommand('copy') }} className="form-input inline-block w-1/2 mt-2 mb-2 sm:text-sm sm:leading-5" value={linkUrl} />
              <span className={`ml-2 text-gray-600 text-sm ${showCopied ? 'inline-block animated fadeInLeft' : 'hidden'}`}>Copied!</span>
            </div>
          )}

          <span className="inline-block mt-2 rounded-md shadow-sm sm:col-start-2">
            <button onClick={onClickGenerateLink} type="button" className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 bg-indigo-600 text-white hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo">
              Generate link
            </button>
          </span>
        </div>
      )}
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
