const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('req-flash');
const config = require('./lib/config');
const serverPipelines = require('./lib/server-pipelines');
const logger = require('./lib/logger');
const events = require('./lib/events');
const isAuthenticated = require('./middlewares/is-authenticated');
const sessionMiddleware = require('./middlewares/session');
const userPublicInfoMiddleware = require('./middlewares/user-public-info');
const studioMiddleware = require('./middlewares/studio');
const healthRoute = require('./routes/health');
const authRoute = require('./routes/auth');
const htmlRoute = require('./routes/html');
const markdownRoute = require('./routes/markdown');
const orgsRoute = require('./routes/orgs');
const projectsRoute = require('./routes/projects');
const apisRoute = require('./routes/apis');
const settingsRoute = require('./routes/settings');
const invitationsRoute = require('./routes/invitations');
const { get: getAPI } = require('./handlers/apis');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  if (config.app.trust_proxy) {
    console.log('Trusting proxy...');
    server.set('trust proxy', true);
  }

  server.use((req, res, next) => {
    req.nextApp = app;
    req.nextHandle = handle;
    res.render = (routePath, params) => {
      req.nextApp.render(req, res, `/_plugins${routePath}`, params);
    };
    next();
  });

  server.use(studioMiddleware);

  server.use(bodyParser.text());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(sessionMiddleware);
  if (config.app.enable_auth) {
    server.use(passport.initialize());
    server.use(passport.session());
  }
  server.use(flash());

  if (dev) {
    server.use(morgan('dev', {
      skip: req => req.path.startsWith('/_next/'),
    }));
  }

  server.get('/:id.yaml', async (req, res, next) => {
    if (req.hostname !== config.file_server.hostname) return next();
    if (!(req.user && req.user.id)) return next();
    const api = await getAPI(req.params.id, req.user.id);
    if (!api) return res.status(404).send('File not found.');

    res.header('Content-Type', 'application/json').send(api.computed_asyncapi);
  });

  server.get('/:id.json', async (req, res, next) => {
    if (req.hostname !== config.file_server.hostname) return next();
    if (!(req.user && req.user.id)) return next();
    const api = await getAPI(req.params.id, req.user.id);
    if (!api) return res.status(404).send('File not found.');

    res.json(api.computed_asyncapi);
  });

  server.use('/_health', healthRoute);
  server.use('/auth', authRoute);
  server.use('/html', htmlRoute);
  server.use('/markdown', markdownRoute);

  serverPipelines.configure(server);
  server.use(userPublicInfoMiddleware);
  serverPipelines.configure(server, true);

  // SESSION REQUIRED
  server.use('/settings', isAuthenticated, settingsRoute);
  server.use('/organizations', isAuthenticated, orgsRoute);
  server.use('/projects', isAuthenticated, projectsRoute);
  server.use('/apis', isAuthenticated, apisRoute);
  server.use('/invitations', invitationsRoute);

  // Front-end routes where session is required...
  server.use('/settings', isAuthenticated);
  server.use('/directory', isAuthenticated);
  // End

  server.get('/_plugins/*', (req, res, next) => {
    res.status(404);
    app.render(req, res, '/404.js', {});
  });

  server.get('*', handle); // Next.js route handler

  server.use((error, req, res, next) => {
    events.emit('server:error', { req, user: req.user, error });

    console.error(error);

    if (req.accepts('html')) {
      res.status(error.status || 500);
      req.err = error;
      return req.nextApp.render(req, res, '/_error');
    }

    res.status(error.status || 500).send(error.toJS ? error.toJS() : {
      type: 'unexpected-error',
      title: 'Unexpected error',
      detail: 'Something went wrong on our side.',
      status: 500,
    });
  });

  /* eslint-disable no-console */
  server.listen(config.app.port, (err) => {
    if (err) throw err;
    const { protocol, hostname, port } = config.app;
    logger.logLineWithBlock('SERVER', 'App is ready! :rocket:', `${protocol}://${hostname}:${port}`, {
      colorFn: logger.chalk.inverse.cyanBright.bold,
    });
  });
})
.catch(console.error);

process
  .on('unhandledRejection', (reason, promise) => {
    events.emit('process:unhandledRejection', { reason, promise });
  })
  .on('uncaughtException', error => {
    events.emit('process:uncaughtException', { error });
  });
