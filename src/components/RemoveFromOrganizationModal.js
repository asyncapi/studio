import DeleteModal from './DeleteModal'

export default function RemoveFromOrganizationModal ({
  user,
  organization,
  onRemove = () => {},
  onCancel = () => {},
}) {
  const onClickDelete = () => {
    fetch(`/organizations/${organization.id}/users/${user.id}`, {
      method: 'DELETE',
    })
      .then(onRemove)
      .catch(console.error)
  }

  return (
  <DeleteModal
    text={`Are you sure you want to remove ${user.displayName} from the ${organization.name} organization?`}
    deleteText="Remove"
    onClickCancel={onCancel}
    onClickDelete={onClickDelete}
  />
  )
}
