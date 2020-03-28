import ConfirmModal from './ConfirmModal'

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
    <ConfirmModal
      text="Are you sure you want to delete this API?"
      okText="Delete"
      type="danger"
      onClickCancel={onCancel}
      onClickOK={onClickDelete}
    />
  )
}
