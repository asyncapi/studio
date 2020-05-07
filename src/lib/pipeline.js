const seq = require('async/seq');
const pipeline = module.exports;

const pipelines = {};

pipeline.create = (name) => {
  pipelines[name] = [];
};

pipeline.append = (name, target, params = {}) => {
  if (!pipelines[name]) pipeline.create(name);
  if (Array.isArray(target)) {
    target.forEach(t => {
      pipelines[name].push({ target: t, params });
    });
  } else {
    pipelines[name].push({ target, params });
  }
  return pipelines[name];
};

pipeline.get = name => pipelines[name];

pipeline.exec = (name, info) => new Promise((resolve, reject) => {
  const wrappedPipeline = pipeline.get(name).map(step => {
    return (info, callback) => {
      info.params = step.params;
      step.target(info, (err) => {
        if (err) {
          if (typeof err === 'string') return callback(new Error(err));
          return callback(err);
        }
        callback(null, info);
      });
    };
  });

  seq(...wrappedPipeline)(info, (err, result) => {
    if (err) return reject(err);
    resolve(result);
  });
});
