const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./lib/config');
const sessionMiddleware = require('./middlewares/session');
const userPublicInfoMiddleware = require('./middlewares/user-public-info');
const authRoute = require('./routes/auth');
const htmlRoute = require('./routes/html');
const markdownRoute = require('./routes/markdown');
const orgsRoute = require('./routes/orgs');
const projectsRoute = require('./routes/projects');
const apisRoute = require('./routes/apis');
const userRoute = require('./routes/user');
const invitationsRoute = require('./routes/invitations');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.text());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(sessionMiddleware);
  server.use(passport.initialize());
  server.use(passport.session());

  if (dev) {
    server.use(morgan('dev', {
      skip: req => req.path.startsWith('/_next/'),
    }));
  }

  // API
  server.use('/organizations', orgsRoute);
  server.use('/projects', projectsRoute);
  server.use('/apis', apisRoute);
  server.use('/invitations', invitationsRoute);

  // Server-side
  server.use('/', userRoute);
  server.use('/auth', authRoute);
  server.use('/html', htmlRoute);
  server.use('/markdown', markdownRoute);

  server.use(userPublicInfoMiddleware);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(config.api.port, (err) => {
    if (err) throw err;
    const { protocol, hostname, port } = config.api;
    console.log(`App ready on ${protocol}://${hostname}:${port}`);
  });
});
