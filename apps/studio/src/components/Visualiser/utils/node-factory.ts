import type { AsyncAPIDocumentInterface as AsyncAPIDocument, ChannelInterface, OperationInterface, MessageInterface } from '@asyncapi/parser/cjs';
import type { Node, Edge } from 'reactflow';

interface FileredChannel {
  channel: string;
  channelModel: ChannelInterface;
  operationModel: OperationInterface;
  messagesModel: MessageInterface[];
}

function getChannelsByOperation(operation: string, spec: AsyncAPIDocument) {
  const channels = spec.channels().all();
  return Object.entries(channels).reduce((filteredChannels: FileredChannel[], [channel, channelModel]) => {
    const operations = operation === 'publish' ? channelModel.operations().filterByReceive() : channelModel.operations().filterBySend();
    if(operations.length) {
      filteredChannels.push(...operations.map((operationModel) => ({
        channel,
        channelModel,
        operationModel,
        messagesModel: operationModel.messages().all()
      })))
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
        title: operationModel.operationId(),
        channel: channelModel.id(),
        tags: operationModel.tags(),
        messages: messagesModel?.map((message) => ({
          title: message.name() || 'default',
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
