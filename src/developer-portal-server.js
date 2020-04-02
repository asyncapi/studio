const path = require('path');
const express = require('express');
const next = require('next');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./lib/config');
const sessionMiddleware = require('./middlewares/session');
const userPublicInfoMiddleware = require('./middlewares/user-public-info');
const { getBySlug, getForUser } = require('./handlers/orgs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  dir: path.resolve(__dirname, 'dp'),
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(sessionMiddleware);
  server.use(passport.initialize());
  server.use(passport.session());

  if (dev) {
    server.use(morgan('dev', {
      skip: req => req.path.startsWith('/_next/'),
    }));
  }

  server.get('/', async (req, res, next) => {
    const host = req.header('host');
    const parts = host.split(`.${config.api.hostname}`);
    if (parts.length <= 1) return res.status(404).send();
    const orgSlug = parts[0];

    const org = await getBySlug(orgSlug);
    if (!org || org.developerPortalVisibility === 'hidden') {
      return res.status(404).send();
    }

    if (org.developerPortalVisibility === 'org') {
      if (!req.user) return res.status(404).send();

      const orgForUser = await getForUser(req.user.id, org.id);
      if (!orgForUser) return res.status(404).send();
    }

    req.org = org;

    next();
  });

  server.use(userPublicInfoMiddleware);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(config.developer_portal.port, (err) => {
    if (err) throw err;
    const { protocol, hostname, port } = config.developer_portal;
    console.log(`Developer portal ready on ${protocol}://${hostname}:${port}`);
  });
});
