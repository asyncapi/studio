import { useState } from 'react'

export default function OrgList ({
  defaultValue = null,
  orgs = [],
  onChange = () => {},
  className,
}) {
  let selected
  let setSelected
  if (defaultValue === null) {
    ([selected, setSelected] = useState(orgs[0] ? orgs[0].id : -1))
  } else {
    ([selected, setSelected] = useState(defaultValue))
  }

  const onChangeOrg = (e) => {
    setSelected(Number(e.target.value))
    onChange(Number(e.target.value))
  }

  return (
    <select name="org" value={selected} onChange={onChangeOrg} className={`${className} form-select mt-2 relative block w-full rounded-md bg-transparent focus:z-10 transition ease-in-out duration-150 sm:text-sm sm:leading-5`} aria-label="Organization">
      {
        orgs.map(org => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))
      }
    </select>
  )
}
