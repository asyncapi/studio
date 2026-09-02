const path = require('path');
const indexPath = path.resolve(__dirname, '../../../node_modules/.pnpm/jsonpath-plus@10.4.0/node_modules/jsonpath-plus/dist/index-node-cjs.cjs');

try {
  module.exports = require(indexPath);
} catch (e) {
  const JSONPath = function() { return []; };
  JSONPath.JSONPath = JSONPath;
  module.exports = { JSONPath };
}
