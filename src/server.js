const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const next = require('next');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./lib/config');
const authRoute = require('./routes/auth');
const htmlRoute = require('./routes/html');
const markdownRoute = require('./routes/markdown');
const orgsRoute = require('./routes/orgs');
const projectsRoute = require('./routes/projects');
const apisRoute = require('./routes/apis');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const redisClient = redis.createClient({
  host: config.session.host,
  port: config.session.port,
  db: 1,
});
redisClient.unref();
redisClient.on('error', console.error);

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.text());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
  }));
  server.use(passport.initialize());
  server.use(passport.session());

  if (dev) {
    server.use(morgan('dev', {
      skip: req => req.path.startsWith('/_next/'),
    }));
  }

  server.use((req, res, next) => {
    if (!req.user) return next();

    req.userPublicInfo = {
      id: req.user.id,
      displayName: req.user.display_name,
      email: req.user.email,
      avatar: req.user.avatar,
      company: req.user.company,
    };

    next();
  });

  // Server-side
  server.use('/auth', authRoute);
  server.use('/html', htmlRoute);
  server.use('/markdown', markdownRoute);

  // API
  server.use('/organizations', orgsRoute);
  server.use('/projects', projectsRoute);
  server.use('/apis', apisRoute);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(config.api.port, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${config.api.port}`);
  });
});
