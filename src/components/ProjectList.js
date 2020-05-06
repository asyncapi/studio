import { useState } from 'react'

export default function ProjectList ({
  defaultValue = null,
  projects = [],
  onChange = () => {},
  className,
}) {
  let selected
  let setSelected
  if (defaultValue === null) {
    ([selected, setSelected] = useState(projects[0] ? projects[0].id : -1))
  } else {
    ([selected, setSelected] = useState(defaultValue))
  }

  const onChangeProject = (e) => {
    setSelected(Number(e.target.value))
    onChange(Number(e.target.value))
  }

  return (
    <select name="project" value={selected} onChange={onChangeProject} className={`${className} form-select mt-2 relative block w-full rounded-md bg-transparent focus:z-10 transition ease-in-out duration-150 sm:text-sm sm:leading-5`} aria-label="Project">
      {
        projects.map(project => (
          <option key={project.id} value={project.id}>{project.organization.name} / {project.name}</option>
        ))
      }
    </select>
  )
}
