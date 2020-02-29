const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./lib/config');
const next = require('next');
const morgan = require('morgan');
const htmlRoute = require('./routes/html');
const markdownRoute = require('./routes/markdown');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.text());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));

  // Server-side

  if (dev) {
    server.use(morgan('dev'));
  }

  server.use('/html', htmlRoute);
  server.use('/markdown', markdownRoute);

  server.use((req, res, next) => {
    req.user = {
      displayName: 'Fran Mendez',
      avatar: 'https://secure.gravatar.com/avatar/f3bad9b06a1b0512c5c837f28dddd985',
      organization: 'AsyncAPI Initiative'
    }
    next()
  })

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(config.api.port, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${config.api.port}`);
  });
});
