import type { OldAsyncAPIDocument as AsyncAPIDocument, OldChannel, OldOperation, OldMessage } from '@asyncapi/parser/cjs';
import type { Elements } from 'react-flow-renderer';

interface FileredChannel {
  channel: string;
  channelModel: OldChannel;
  operationModel: OldOperation;
  messagesModel: OldMessage[];
}

const getChannelsByOperation = (operation: string, spec: AsyncAPIDocument) => {
  const channels = spec.channels();

  return Object.keys(channels).reduce((filteredChannels: FileredChannel[], channel) => {
    const operationFn = operation === 'publish' ? 'hasPublish' : 'hasSubscribe';
    // eslint-disable-next-line
    if (channels[String(channel)][operationFn]()) {
      const operationModel = (channels as any)[String(channel)][String(operation)]() as OldOperation;
      filteredChannels.push({
        channel,
        channelModel: channels[String(channel)],
        operationModel,
        messagesModel: operationModel.messages(),
      });
    }
    return filteredChannels;
  }, []);
};

const buildFlowElementsForOperation = ({ operation, spec, applicationLinkType, data }: { operation: 'publish' | 'subscribe'; spec: AsyncAPIDocument; applicationLinkType: string, data: any }) => {
  const filteredChannels = getChannelsByOperation(operation, spec);
  return filteredChannels.reduce((nodes: any, channel) => {
    const { channelModel, operationModel, messagesModel } = channel;

    const node = {
      id: `${operation}-${channel.channel}`,
      type: `${operation}Node`,
      data: {
        title: operationModel.id(),
        channel: channel.channel,
        tags: operationModel.tags(),
        messages: messagesModel.map((message) => ({
          title: message.uid(),
          description: message.description(),
        })),

        spec,
        description: channelModel.description(),
        operationId: operationModel.id(),
        elementType: operation,
        theme: operation === 'subscribe' ? 'yellow' : 'green',
        ...data
      },
      position: { x: 0, y: 0 },
    };

    const connectorNode = {
      id: `${operation}-${channel.channel}-to-application`,
      // type: 'smoothstep',
      // animated: true,
      // label: messagesModel.map(message => message.uid()).join(','),
      style: { stroke: applicationLinkType === 'target' ? '#7ee3be' : 'orange', strokeWidth: 4 },
      source: applicationLinkType === 'target' ? `${operation}-${channel.channel}` : 'application',
      target: applicationLinkType === 'target' ? 'application' : `${operation}-${channel.channel}`,
    };
    return [...nodes, node, connectorNode];
  }, []);
};

export const getElementsFromAsyncAPISpec = (spec: AsyncAPIDocument): Elements => {
  const publishNodes = buildFlowElementsForOperation({
    operation: 'publish',
    spec,
    applicationLinkType: 'target',
    data: { columnToRenderIn: 'col-1' },
  });

  const subscribeNodes = buildFlowElementsForOperation({
    operation: 'subscribe',
    spec,
    applicationLinkType: 'source',
    data: { columnToRenderIn: 'col-3' },
  });

  const applicationNode = {
    id: 'application',
    type: 'applicationNode',
    data: { spec, elementType: 'application', theme: 'indigo', columnToRenderIn: 'col-2' },
    position: { x: 0, y: 0 },
  };
  return [...publishNodes, applicationNode, ...subscribeNodes];
};
