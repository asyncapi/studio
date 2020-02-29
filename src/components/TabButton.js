export default function TabButton ({ children, active = false, onClick = () => {} }) {
  let classes = 'ml-4 px-3 py-2 font-medium text-sm leading-5 rounded-md focus:outline-none'

  if (active) {
    classes += ' text-indigo-700 bg-indigo-100 focus:text-indigo-800 focus:bg-indigo-200'
  } else {
    classes += ' text-gray-500 hover:text-gray-300 focus:text-indigo-600 focus:bg-indigo-50'
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
