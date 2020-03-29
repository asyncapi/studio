const isBrowser = require('../components/helpers/is-browser');

module.exports = function buildInvitationUrl (uuid) {
  const origin = isBrowser() ? window.location.origin : ''
  return `${origin}/invitations/${uuid}/accept`;
};
