const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./lib/config');
const pipeline = require('./lib/pipeline');
const isAuthenticated = require('./middlewares/is-authenticated');
const sessionMiddleware = require('./middlewares/session');
const userPublicInfoMiddleware = require('./middlewares/user-public-info');
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
    next();
  });

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

  pipeline.get('server:routes').forEach(step => {
    let method = 'get';
    if (step.params.method && ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(step.params.method.toLowerCase())) {
      method = step.params.method;
    }
    server[method](step.params.urlPath, step.target);
  });

  pipeline.get('server:middlewares').forEach(step => {
    server.use(step.target);
  });

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

  server.use(userPublicInfoMiddleware);
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(config.app.port, (err) => {
    if (err) throw err;
    const { protocol, hostname, port } = config.app;
    console.log(`App ready on ${protocol}://${hostname}:${port}`);
  });
});
