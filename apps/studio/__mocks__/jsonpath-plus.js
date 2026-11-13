// jsonpath-plus is a transitive dependency of @asyncapi/parser whose default export
// condition is an ESM build that jest cannot load. Resolve the package through the
// parser's dependency tree and load its CommonJS build explicitly, so the mock does
// not depend on the pnpm store layout or on a specific jsonpath-plus version.
const path = require('path');

const parserDir = path.dirname(require.resolve('@asyncapi/parser/package.json'));
const jsonpathDir = path.dirname(require.resolve('jsonpath-plus/package.json', { paths: [parserDir] }));

module.exports = require(path.join(jsonpathDir, 'dist', 'index-node-cjs.cjs'));
