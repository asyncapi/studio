import { FaExternalLinkAlt } from 'react-icons/fa'

export default function ErrorPage({ title, detail, type, url }) {
  return (
    <div className="flex flex-row fixed left-0 top-0 right-0 bottom-0 bg-gray-800">
      <div className="flex flex-row flex-1 h-56 self-center items-end mb-32">
        <div className="flex w-1/2 h-32 items-center justify-end pr-4">
          <h3 className="text-right uppercase text-6xl font-bold text-gray-400">
            Error
          </h3>
        </div>
        <div className="flex flex-col w-1/2 h-32 items-start justify-center pl-4">
          <p className="text-white">
            {title}
          </p>
          <p className="text-gray-400">
            {detail}
          </p>
          { url && (
            <p className="text-gray-600">
              <a href={url} className="hover:text-teal-400 transition duration-500 ease-in-out" target="_blank" rel="noopener noreferrer">{type} <FaExternalLinkAlt className="inline-block text-xs ml-1 mb-1" /></a>
            </p>
          ) }
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const error = req.err && req.err.toJS ? req.err.toJS() : {
    title: 'Unexpected Error',
    detail: req.err ? req.err.message : 'Something went wrong on our side.',
  };

  return {
    props: error,
  }
}
