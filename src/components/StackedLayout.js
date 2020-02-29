import Topbar from './Topbar'

export default function StackedLayout ({ title, children, page }) {
  return (
    <div>
      <div className="bg-gray-800 pb-32">
        <Topbar active={page} />
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl leading-9 font-bold text-white">
              {title}
            </h2>
          </div>
        </header>
      </div>
      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
