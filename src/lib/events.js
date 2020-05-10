const EventEmitter = require('events');
const config = require('./config');
const packageJSON = require('../../package.json');
const events = module.exports;

const eventEmitter = new EventEmitter();

events.on = eventEmitter.on.bind(eventEmitter);
events.once = eventEmitter.once.bind(eventEmitter);
events.emit = (eventName, eventPayload, ...args) => {
  const newPayload = {
    ...eventPayload,
    ...{
      config,
      packageJSON,
    },
  };

  eventEmitter.emit(eventName, newPayload, ...args)
};
