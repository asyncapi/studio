const pipeline = require('./pipeline');
const { logErrorLineWithBlock } = require('./logger');
const isAuthenticated = require('../middlewares/is-authenticated');

const serverHooks = module.exports;

serverHooks.configure = (server, authenticated = false) => {
  const routeHookName = `server:routes${authenticated ? ':authenticated' : ''}`;
  const middlewareHookName = `server:middlewares${authenticated ? ':authenticated' : ''}`;

  pipeline.get(routeHookName).forEach(serverHooks.route(routeHookName, server));
  pipeline.get(middlewareHookName).forEach(serverHooks.middleware(middlewareHookName, server));
};

serverHooks.route = (hook, server) => step => {
  if (!step.params.urlPath) {
    logErrorLineWithBlock('HOOK', hook, `Missing mandatory urlPath param on plugin ${step.params.pluginName}. Skipping...`, { highlightedWords: ['urlPath', step.params.pluginName] });
    return;
  }

  let method = 'get';
  if (step.params.method && ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(step.params.method.toLowerCase())) {
    method = step.params.method;
  }

  if (hook.endsWith(':authenticated')) {
    server[method](step.params.urlPath, isAuthenticated, step.target);
  } else {
    server[method](step.params.urlPath, step.target);
  }
};

serverHooks.middleware = (hook, server) => step => {
  if (hook.endsWith(':authenticated')) {
    server.use(isAuthenticated, step.target);
  } else {
    server.use(step.target);
  }
};
