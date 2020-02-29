import DownloadAsButton from './DownloadAsButton'

export default function PreviewToolbar ({ code }) {
  return (
    <nav className="flex flex-col content-end flex-wrap bg-gray-800 px-4 py-3 shadow-md z-10">
      <DownloadAsButton code={code} />
    </nav>
  )
}
