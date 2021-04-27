const EventEmitter = require("events");
const clientEvents = module.exports;

const eventEmitter = new EventEmitter();

clientEvents.on = eventEmitter.on.bind(eventEmitter);
clientEvents.once = eventEmitter.once.bind(eventEmitter);
clientEvents.emit = (eventName, eventPayload, ...args) => {
  eventEmitter.emit(eventName, eventPayload, ...args);
};
