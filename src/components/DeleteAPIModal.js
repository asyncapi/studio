import DeleteModal from './DeleteModal'

export default function DeleteAPIModal ({
  api,
  onDelete = () => {},
  onCancel = () => {},
}) {
  const onClickDelete = () => {
    fetch(`/apis/${api.id}`, {
      method: 'DELETE',
    })
      .then(onDelete)
      .catch(console.error)
  }

  return (
  <DeleteModal
    text="Are you sure you want to delete this API?"
    onClickCancel={onCancel}
    onClickDelete={onClickDelete}
  />
  )
}
