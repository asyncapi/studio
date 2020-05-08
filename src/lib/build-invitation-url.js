module.exports = function buildInvitationUrl (uuid) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/invitations/${uuid}/accept`;
};
