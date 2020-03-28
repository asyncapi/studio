export default function ConfirmModal ({
  text,
  okText = 'OK',
  cancelText = 'Cancel',
  onClickOK = () => {},
  onClickCancel = () => {},
  type = 'question', // Can be "danger" too
}) {
  let buttonClassName = 'bg-indigo-600 text-white hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo'

  if (type === 'danger') buttonClassName = 'bg-red-600 text-white hover:bg-red-500 focus:border-red-700 focus:shadow-outline-red'

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
        <div className="text-center">
        { typeof text === 'string' ? (<div>{text}</div>) : text }
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
            <button onClick={onClickOK} type="button" className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${buttonClassName}`}>
              {okText}
            </button>
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
            <button onClick={onClickCancel} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              {cancelText}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
