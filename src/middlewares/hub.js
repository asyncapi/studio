const config = require('../lib/config');
const ui = require('../../config/ui.json');
const HubError = require('../error');
const apis = require('../handlers/apis');
const orgs = require('../handlers/orgs');
const invitations = require('../handlers/invitations');
const projects = require('../handlers/projects');
const users = require('../handlers/users');

module.exports = (req, res, next) => {
  if (!req.hub) req.hub = {};
  req.hub = {
    config,
    ui,
    HubError,
    orgs,
    apis,
    invitations,
    projects,
    users,
  };

  next();
};
