const slug = require('slugify');

module.exports = text => slug(text, {
  lower: true,
});
