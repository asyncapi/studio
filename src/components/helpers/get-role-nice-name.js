export default function getRoleNiceText(role) {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'member':
      return 'Member'
  }
}
