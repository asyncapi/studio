// @ts-nocheck

// protocol examples
import kafka from '!!raw-loader!./streetlights-kafka.yml';
import websocket from '!!raw-loader!./websocket-gemini.yml';
import mqtt from '!!raw-loader!./streetlights-mqtt.yml';
import simple from '!!raw-loader!./simple.yml';

// real world examples
import slack from '!!raw-loader!./real-world/slack-rtm.yml';
import gitterStreaming from '!!raw-loader!./real-world/gitter-streaming.yml';

const templateTypes = {
  protocol: 'protocol-example',
  realExample: 'real-example'
};

export default [
  {
    title: 'Simple Example',
    description: () => <>A basic example of a service that is in charge of processing user signups. Great place to start learning AsyncAPI.</>,
    template: simple,
    type: templateTypes.protocol
  },
  {
    title: 'Simple Hello World',
    description: () => <>A basic example of a service that is in charge of processing user signups. Great place to start learning AsyncAPI.</>,
    template: simple,
    type: templateTypes.protocol
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
    description: () => <>A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.</>,
    template: mqtt,
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
  }
];
