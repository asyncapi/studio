const React = require('react');

module.exports = function AsyncApiComponent(props) {
  return React.createElement('div', { 'data-testid': 'asyncapi-component' }, props.children);
};
