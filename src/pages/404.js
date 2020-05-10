export default function NotFound() {
  return (
    <div className="flex flex-row fixed left-0 top-0 right-0 bottom-0 bg-gray-800">
      <div className="flex flex-row flex-1 h-56 self-center items-end mb-32">
        <div className="flex w-1/2 h-32 items-center justify-end pr-4">
          <h3 className="text-right uppercase text-6xl font-bold text-gray-400">
            404
          </h3>
        </div>
        <div className="flex flex-col w-1/2 h-32 items-start justify-center pl-4">
          <p className="text-white">
            Not Found
          </p>
          <p className="text-gray-500">
            The page you're looking for is not here
          </p>
        </div>
      </div>
    </div>
  )
}
