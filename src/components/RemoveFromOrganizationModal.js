import ConfirmModal from './ConfirmModal'

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
  <ConfirmModal
    text={(<span>Are you sure you want to remove <strong>{user.displayName}</strong> from the <strong>{organization.name}</strong> organization?</span>)}
    okText="Remove"
    type="danger"
    onClickCancel={onCancel}
    onClickOK={onClickDelete}
  />
  )
}
