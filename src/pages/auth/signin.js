import { FaGithub } from 'react-icons/fa'

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="/img/logo-horizontal-color.svg" />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white pt-2 pb-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="mt-6 mb-8 text-center text-3xl leading-9 font-normal text-gray-900">
            Sign in to your account
          </h2>

          <a href="/auth/github" className="inline-block w-full text-center py-2 px-4 shadow border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
            <FaGithub className="text-xl mr-2 -mt-0.5 inline-block" />
            <span className="inline-block">Sign in using Github</span>
          </a>
        </div>
      </div>
    </div>
  )
}
