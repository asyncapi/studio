import moment from 'moment'
import { FaCheckCircle, FaUsers, FaTimes } from 'react-icons/fa'
import SettingsLayout from '../../../components/SettingsLayout'

export default function ProfilePage ({ organizations, selectedOrg, members = [] }) {
  console.log(members)
  return (
    <SettingsLayout
      active="orgs"
      organizations={organizations}
      selectedOrg={selectedOrg}
    >
      <div>
        <h3 className="text-xl mb-4">Members</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul>
            <li>
              <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                { members.map((member, index) => (
                  <div key={index} className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0">
                        <img className="h-12 w-12 rounded-full object-cover" src={member.avatar} alt={`${member.displayName}'s avatar`} />
                      </div>
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                        <div>
                          <div className="text-sm leading-5 font-medium text-indigo-600 truncate">{member.displayName}</div>
                          <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                        <div className="hidden md:block">
                          <div className="m-auto">
                            <div className="text-sm leading-5 text-gray-900">
                              <FaCheckCircle className="text-green-400 inline-block mr-2" />
                              Joined on
                              <time dateTime={member.joinedOrganizationAt} className="ml-1">{moment(member.joinedOrganizationAt).format('MMMM Do YYYY')}</time>
                            </div>
                            { member.role === 'admin' && (
                              <div className="text-sm leading-5 text-gray-500 font-bold mt-2">
                                <FaUsers className="text-gray-400 inline-block mr-2" />
                                Administrator
                              </div>
                            ) }
                          </div>
                        </div>
                        <div className="flex flex-row items-center">
                          <div className="flex flex-1 flex-col items-end">
                            <span className="inline-block rounded-full shadow-sm">
                              <button type="button" className="inline-flex items-center px-2 py-2 border-2 border-gray-300 text-sm font-medium rounded-full text-gray-300 bg-transparent hover:text-white hover:bg-red-500 hover:border-red-500 focus:outline-none focus:border-red-500 focus:shadow-outline-red active:bg-red-700 active:border-red-500 transition ease-in-out duration-150" title="Remove from organization">
                                <FaTimes />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </SettingsLayout>
  )
}

export async function getServerSideProps ({ req, params }) {
  if (!req.userPublicInfo) return { props: {} }

  const { list: listOrgs, listUsers } = require('../../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)
  let members = await listUsers(params.id)
  members = members.map(member => formatMember(member))

  return {
    props: {
      organizations,
      selectedOrg: params.id,
      members,
    },
  }
}

function formatMember (user) {
  const result = user

  result.displayName = result.display_name
  delete result.display_name
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
