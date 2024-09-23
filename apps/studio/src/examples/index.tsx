// @ts-nocheck

// protocol examples
import kafka from './streetlights-kafka.yml';
import websocket from './websocket-gemini.yml';
import mqtt from './streetlights-mqtt.yml';
import simple from './simple.yml';
import ibmmq from './ibmmq.yml';

// tutorial example
import invalid from './tutorials/invalid.yml';

// real world examples
import slack from './real-world/slack-rtm.yml';
import gitterStreaming from './real-world/gitter-streaming.yml';
import kraken from './real-world/kraken-api-request-reply-filter.yml';

const templateTypes = {
  protocol: 'protocol-example',
  realExample: 'real-example',
  tutorial: 'tutorial-example'
};

export default [
  {
    title: 'Simple Example',
    description: () => <>A basic example of a service that is in charge of processing user signups. Great place to start learning AsyncAPI.</>,
    template: simple,
    type: templateTypes.protocol
  },
  {
    title: 'Invalid Example',
    description: () => <>An example of an invalid AsyncAPI document. This is only for educational purposes, to learn document validation.</>,
    template: invalid,
    type: templateTypes.tutorial
  },
  {
    title: 'Apache Kafka',
    description: () => <>A framework implementation of a software bus using stream-processing. Open Source developed by the Apache Software Foundation.</>,
    template: kafka,
    type: templateTypes.protocol
  },
  {
    title: 'WebSocket',
    description: () => <>A computer communications protocol, providing full-duplex communication channels over a single TCP connection.</>,
    template: websocket,
    type: templateTypes.protocol
  },
  {
    title: 'MQTT',
    description: () => <>An OASIS standard messaging protocol for the Internet of Things. Ideal for connecting remote devices with limited processing power and bandwidth.</>,
    template: mqtt,
    type: templateTypes.protocol
  },
  {
    title: 'IBM MQ',
    description: () => <>A robust, reliable, and secure messaging solution. IBM MQ simplifies and accelerates the integration of different applications across multiple platforms and supports a wide range of APIs and languages.</>,
    template: ibmmq,
    type: templateTypes.protocol
  },
  {
    title: 'HTTP',
    description: () => <>A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.</>,
    template: gitterStreaming,
    type: templateTypes.protocol
  },
  {
    title: 'Slack Real Time Messaging API',
    description: () => <>Slack Real time messaging API. Using HTTP protocol.</>,
    template: slack,
    type: templateTypes.realExample
  },
  {
    title: 'Gitter Streaming API',
    description: () => <>Gitter Streaming API from https://stream.gitter.im. Using HTTP protocol.</>,
    template: gitterStreaming,
    type: templateTypes.realExample
  },
  {
    title: 'Kraken Websockets API',
    description: () => <>This Kraken Websocket specification. Using Websocket with request / reply</>,
    template: kraken,
    type: templateTypes.realExample
  }
];
