import type { OldAsyncAPIDocument as AsyncAPIDocument, OldChannel, OldOperation, OldMessage } from '@asyncapi/parser/cjs';
import type { Node, Edge } from 'reactflow';

interface FileredChannel {
  channel: string;
  channelModel: OldChannel;
  operationModel: OldOperation;
  messagesModel: OldMessage[];
}

function getChannelsByOperation(operation: string, spec: AsyncAPIDocument) {
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
}

function buildFlowElementsForOperation({ operation, spec, applicationLinkType, data }: { operation: 'publish' | 'subscribe'; spec: AsyncAPIDocument; applicationLinkType: string, data: any }): Array<{ node: Node, edge: Edge }> {
  return getChannelsByOperation(operation, spec).reduce((nodes: any, channel) => {
    const { channelModel, operationModel, messagesModel } = channel;

    const node: Node = {
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
        theme: operation === 'subscribe' ? 'green' : 'blue',
        ...data
      },
      position: { x: 0, y: 0 },
    };

    const edge: Edge = {
      id: `${operation}-${channel.channel}-to-application`,
      // type: 'smoothstep',
      // animated: true,
      // label: messagesModel.map(message => message.uid()).join(','),
      style: { stroke: applicationLinkType === 'target' ? '#00A5FA' : '#7ee3be', strokeWidth: 4 },
      source: applicationLinkType === 'target' ? `${operation}-${channel.channel}` : 'application',
      target: applicationLinkType === 'target' ? 'application' : `${operation}-${channel.channel}`,
    };

    return [...nodes, { node, edge }];
  }, []);
}

export function getElementsFromAsyncAPISpec(spec: AsyncAPIDocument): Array<{ node: Node, edge: Edge }> {
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

  return [
    ...publishNodes, 
    { node: applicationNode } as { node: Node, edge: Edge }, 
    ...subscribeNodes
  ];
}
