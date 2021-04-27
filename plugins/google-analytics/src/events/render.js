const { init } = require('../lib/google-analytics');

module.exports = ({ window }) => {
    init(window);
}