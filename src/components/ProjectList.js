export default function ProjectList ({
  defaultValue = null,
  projects = [],
  onChange = () => {},
  className,
}) {
  if (defaultValue === null) defaultValue = projects[0] ? projects[0].id : -1

  const onChangeProject = (e) => {
    onChange(Number(e.target.value))
  }

  return (
    <select name="project" value={defaultValue} onChange={onChangeProject} className={`${className} form-select mt-2 relative block w-full rounded-md bg-transparent focus:z-10 transition ease-in-out duration-150 sm:text-sm sm:leading-5`} aria-label="Project">
      {
        projects.map(project => (
          <option key={project.id} value={project.id}>{project.org_name} / {project.name}</option>
        ))
      }
    </select>
  )
}
