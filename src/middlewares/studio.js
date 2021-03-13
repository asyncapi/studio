const config = require('../lib/config');
const ui = require('../../config/ui.json');
const HubError = require('../error');
const apis = require('../handlers/apis');
const orgs = require('../handlers/orgs');
const invitations = require('../handlers/invitations');
const projects = require('../handlers/projects');
const users = require('../handlers/users');

module.exports = (req, res, next) => {
  if (!req.studio) req.studio = {};
  req.studio = {
    config,
    ui,
    HubError,
    orgs,
    apis,
    invitations,
    projects,
    users,
  };

  req.studio.ui.enableAuth = config.app.enable_auth;

  next();
};
