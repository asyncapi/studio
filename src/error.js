const config = require('./lib/config');

class HubError extends Error {
  constructor(definition) {
    super(definition.title);
    this.type = definition.type;
    this.title = definition.title;
    this.detail = definition.detail;
    this.status = definition.status || 500;
  }

  toJS() {
    const { protocol, hostname, port } = config.app;
    const isDev = process.env.NODE_ENV !== 'production';
    const prefix = `${protocol}://${hostname}${isDev ? `:${port}` : ''}/errors/`;

    return {
      type: this.type,
      url: `${prefix}${this.type}`,
      title: this.title,
      detail: this.detail,
      status: this.status,
    };
  }
}

module.exports = HubError;
