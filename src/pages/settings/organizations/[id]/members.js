import { useState, useContext } from 'react'
import moment from 'moment'
import { FaCheckCircle, FaUsers, FaRegEnvelope, FaEllipsisV } from 'react-icons/fa'
import SettingsLayout from '../../../../components/SettingsLayout'
import Dropdown from '../../../../components/Dropdown'
import RemoveFromOrganizationModal from '../../../../components/RemoveFromOrganizationModal'
import ChangeUserRoleModal from '../../../../components/ChangeUserRoleModal'
import AppContext from '../../../../contexts/AppContext'

export default function OrganizationPage({ organizations, selectedOrg, users = [] }) {
  const [showRemoveFromOrganizationModal, setShowRemoveFromOrganizationModal] = useState()
  const [changeRoleModalDetails, showChangeRoleModal] = useState()
  const { user: loggedInUser } = useContext(AppContext)

  const admins = users.filter(m => m.role === 'admin')
  const org = organizations.find(o => o.id == selectedOrg)

  const loggedInUserIsAdmin = admins.find(a => a.id === loggedInUser.id)
  const userIsNotTheOnlyAdmin = user => admins.find(a => a.id !== user.id)

  return (
    <SettingsLayout
      active="orgs"
      organizations={organizations}
      selectedOrg={selectedOrg}
      selectedSection="members"
    >
      {showRemoveFromOrganizationModal && (
        <RemoveFromOrganizationModal
          user={showRemoveFromOrganizationModal}
          organization={org}
          onCancel={() => setShowRemoveFromOrganizationModal(false)}
          onRemove={() => window.location.reload()}
        />
      )}
      {changeRoleModalDetails && (
        <ChangeUserRoleModal
          user={changeRoleModalDetails.user}
          organization={org}
          role={changeRoleModalDetails.role}
          onCancel={() => showChangeRoleModal(false)}
          onChange={() => window.location.reload()}
        />
      )}
      <div>
        <div className="mb-12">
          <h3 className="text-xl mb-4">Members</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                <div className="mb-4 bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} title={`${user.displayName}'s avatar`} />
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                          <div>
                            <div className="text-sm leading-5 font-medium text-indigo-600 truncate">{user.displayName}</div>
                            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <FaRegEnvelope className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="truncate" title={user.email}>{user.email}</span>
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <div className="m-auto">
                              <div className="text-sm leading-5 text-gray-900">
                                <FaCheckCircle className="text-green-400 inline-block mr-2" />
                              Joined on
                              <time dateTime={user.organizationsForUser[0].createdAt} className="ml-1">{moment(user.organizationsForUser[0].createdAt).format('MMMM Do YYYY')}</time>
                              </div>
                              <div className={`text-sm leading-5 text-gray-500 ${user.organizationsForUser[0].role === 'admin' && 'font-bold'} mt-2`}>
                                <FaUsers className="text-gray-400 inline-block mr-2" />
                                {user.organizationsForUser[0].role === 'admin' && 'Administrator'}
                                {user.organizationsForUser[0].role === 'member' && 'Member'}
                              </div>
                            </div>
                          </div>
                          {userIsNotTheOnlyAdmin(user) && loggedInUserIsAdmin && (
                            <div className="flex flex-row items-center">
                              <div className="flex flex-1 flex-col items-end text-gray-400">
                                <Dropdown
                                  title=""
                                  showCaret={false}
                                  icon={<FaEllipsisV className="text-md mt-1 mr-2 hover:text-gray-600" />}
                                  className=""
                                  buttonHoverClassName="hover:text-gray-600"
                                >
                                  {user.organizationsForUser[0].role === 'admin' && (<a onClick={() => showChangeRoleModal({ user, role: 'member' })} className="block px-4 py-2 text-sm leading-5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Make member...</a>)}
                                  {user.organizationsForUser[0].role === 'member' && (<a onClick={() => showChangeRoleModal({ user, role: 'admin' })} className="block px-4 py-2 text-sm leading-5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Make admin...</a>)}
                                  <a onClick={() => setShowRemoveFromOrganizationModal(user)} className="block px-4 py-2 text-sm leading-5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Remove from organization...</a>
                                </Dropdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SettingsLayout>
  )
}

export async function getServerSideProps({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listOrgs, listUsers } = require('../../../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)
  const users = await listUsers(params.id)

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
