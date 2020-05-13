import SettingsLayout from '../../components/SettingsLayout'

export default function ProfilePage ({ displayName, username, email, company, avatar, organizations }) {
  return (
    <SettingsLayout
      activeSection="profile"
      organizations={organizations}
    >
      <form method="POST">
        <div className="mb-4 mt-4 text-center">
          <img src={avatar} title="Your avatar" className="inline-block rounded-full object-cover w-36" />
        </div>
        <div className="flex">
          <div className="flex-1 mt-4">
            <div className="mr-2">
              <label className="block text-sm font-medium leading-5 text-gray-700">Display name</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <input type="text" name="displayName" className="form-input block w-full sm:text-sm sm:leading-5" defaultValue={displayName} required />
              </div>
            </div>
          </div>
          <div className="flex-1 mt-4">
            <div className="ml-2">
              <label className="block text-sm font-medium leading-5 text-gray-700">Username</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <input type="text" title="Username can't be changed" className="form-input block w-full sm:text-sm sm:leading-5 text-gray-400" defaultValue={username} disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 mt-4">
            <div className="mr-2">
              <label className="block text-sm font-medium leading-5 text-gray-700">Email</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <input type="text" title="Email can't be changed" className="form-input block w-full sm:text-sm sm:leading-5 text-gray-400" defaultValue={email} disabled />
              </div>
            </div>
          </div>
          <div className="flex-1 mt-4">
            <div className="ml-2">
              <label className="block text-sm font-medium leading-5 text-gray-700">Company</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <input type="text" name="company" className="form-input block w-full sm:text-sm sm:leading-5" defaultValue={company} required />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="block w-full mt-4 text-center rounded-md shadow-sm px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
          Update
        </button>
      </form>
    </SettingsLayout>
  )
}

export async function getServerSideProps ({ req }) {
  if (!req.userPublicInfo) return { props: {} }

  const {
    username,
    displayName,
    email,
    company,
    avatar,
  } = req.userPublicInfo

  const { list: listOrgs } = require('../../handlers/orgs')
  const organizations = await listOrgs(req.userPublicInfo.id)

  return {
    props: {
      username: username || null,
      displayName: displayName || null,
      email: email || null,
      company: company || null,
      avatar: avatar || null,
      organizations,
    },
  }
}
