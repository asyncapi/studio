const pipeline = require('./pipeline');
const { logErrorLineWithBlock } = require('./logger');
const isAuthenticated = require('../middlewares/is-authenticated');

const serverPipelines = module.exports;

serverPipelines.configure = (server, authenticated = false) => {
  const routePipelineName = `__server:routes${authenticated ? ':authenticated' : ''}__`;
  const middlewarePipelineName = `__server:middlewares${authenticated ? ':authenticated' : ''}__`;

  pipeline.get(routePipelineName).forEach(serverPipelines.route(routePipelineName, server));
  pipeline.get(middlewarePipelineName).forEach(serverPipelines.middleware(middlewarePipelineName, server));
};

serverPipelines.route = (pipelineName, server) => step => {
  if (!step.params.urlPath) {
    logErrorLineWithBlock('ROUTE', pipelineName, `Missing mandatory urlPath param on plugin ${step.params.pluginName}. Skipping...`, { highlightedWords: ['urlPath', step.params.pluginName] });
    return;
  }

  let method = 'get';
  if (step.params.method && ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(step.params.method.toLowerCase())) {
    method = step.params.method;
  }

  if (pipelineName.endsWith(':authenticated__')) {
    server[method](step.params.urlPath, isAuthenticated, step.target);
  } else {
    server[method](step.params.urlPath, step.target);
  }
};

serverPipelines.middleware = (pipelineName, server) => step => {
  if (pipelineName.endsWith(':authenticated__')) {
    server.use(isAuthenticated, step.target);
  } else {
    server.use(step.target);
  }
};
