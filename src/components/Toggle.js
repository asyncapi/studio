import { useState } from 'react'

export default function Toggle({ initiallyActive = false }) {
  const [active, setActive] = useState(initiallyActive)
  const classes = 'relative inline-block flex-no-shrink h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline transform scale-50 -translate-x-1'
  const offClasses = `${classes} bg-gray-200`
  const onClasses = `${classes} bg-indigo-600`

  return (
    <span onClick={() => setActive(!active)} className={active ? onClasses : offClasses} role="checkbox" tabIndex="0">
      <span aria-hidden="true" className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${active && 'translate-x-5'}`}></span>
    </span >
  )
}
