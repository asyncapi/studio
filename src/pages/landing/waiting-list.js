export default function WaitingList ({ displayName, email}) {
  return (
    <div className="flex h-full">
      <div className="w-80 m-auto mt-12 text-center">
        <img src="/img/waiting.svg" className="block" />

        <h1 className="text-2xl mt-4">Thanks for signing up, {displayName}!</h1>
        <p className="text-gray-500 mt-4">We are overwhelmed by the amount of requests received. We'll send you an email to <strong>{email}</strong> once you make it out of the waiting list. Thanks for your support!</p>
        <a href="/" className="block w-full mt-4 text-center rounded-md shadow-sm px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
          Go to the homepage
        </a>
      </div>
    </div>
  )
}

export async function getServerSideProps ({ req }) {
  return {
    props: {
      displayName: req.user.display_name,
      email: req.user.email,
    },
  }
}
