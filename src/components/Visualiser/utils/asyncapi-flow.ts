// @ts-nochec
// /* eslint-disable */
import { isNode, Elements, Node } from 'react-flow-renderer';
import { AsyncAPIDocument, Operation, Channel, Message } from '@asyncapi/parser';

interface FileredChannel {
  channel: string
  channelModel: Channel,
  operationModel: Operation,
  messagesModel: Message[]
}

const getChannelByOperation = (operation: string, spec: AsyncAPIDocument) => {
  const channels = spec.channels();

  return Object.keys(channels).reduce((filteredChannels: FileredChannel[], channel) => {
    if (operation === 'publish' && channels[String(channel)].hasPublish()) {
      const operationModel = (channels as any)[String(channel)].publish() as Operation;

      filteredChannels.push({
        channel,
        channelModel: channels[String(channel)],
        operationModel,
        messagesModel: operationModel.messages(),
      });
    }

    if (operation === 'subscribe' && channels[String(channel)].hasSubscribe()) {
      const operationModel = (channels as any)[String(channel)].subscribe() as Operation;

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

const buildNodesForOperation = ({ operation, spec, group, applicationLinkType }: {
  operation: 'publish' | 'subscribe',
  spec: AsyncAPIDocument,
  group: string,
  applicationLinkType: string
}) => {
  const channels = getChannelByOperation(operation, spec);
  return channels.reduce((nodes: any, channel) => {
    const { channelModel, operationModel, messagesModel } = channel;

    const node = {
      id: `${operation}-${channel.channel}`,
      type: `${operation}Node`,
      groupId: group,
      data: {
        title: operationModel.id(),
        channel: channel.channel,
        tags: operationModel.tags(),
        messages: messagesModel.map(message => ({
          title: message.uid(),
          description: message.description()
        })),

        // TODO: Decouple the nodes and this
        spec,
        description: channelModel.description(),
        operationId: operationModel.id(),
        elementType: operation,
        theme: operation === 'subscribe' ? 'yellow' : 'green',
      },
      position: { x: 0, y: 0 },
    };

    const connectorNode = {
      id: `${operation}-${channel.channel}-to-application`,
      type: 'smoothstep',
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
  const publishNodes = buildNodesForOperation({
    operation: 'publish',
    spec,
    group: 'group1',
    applicationLinkType: 'target',
  });
  
  //   const subscribeNodes = buildNodesForOperation({
  //     operation: 'subscribe',
  //     spec,
  //     group: 'group3',
  //     applicationLinkType: 'source',
  //   });
  const applicationNode = {
    id: 'application',
    groupId: 'group2',
    type: 'applicationNode',
    data: { spec, elementType: 'application', theme: 'indigo' },
    position: { x: 0, y: 0 },
  };
  return [...publishNodes, applicationNode];

//   return [...publishNodes, applicationNode, ...subscribeNodes];
};

// TODO: Stop adding groupID to this!!
export const getNodesForAutoLayout = (elements: any) => {
  const splitNodesByGroupId = elements.reduce((elementsGrouped: any, element: { groupId: string, __rf: any }) => {
    if (isNode(element as any) && element.__rf) {
      return {
        ...elementsGrouped,
        [element.groupId]: elementsGrouped[element?.groupId]
          ? elementsGrouped[element?.groupId].concat([element])
          : (elementsGrouped[element?.groupId] = [element]),
      };
    }
    return elementsGrouped;
  }, {});

  const newElements: any = Object.keys(splitNodesByGroupId).reduce(
    (data:any, group:any) => {
      const groupNodes = splitNodesByGroupId[String(group)];

      // Get the max width of this group (column) on the UI
      // eslint-disable-next-line prefer-spread
      const maxWidthOfGroup = Math.max.apply(
        Math,
        groupNodes.map((o: Node) => {
          return o.__rf.width;
        })
      );

      // For each group (column), render the nodes based on height they require (with some padding)
      const { positionedNodes } = groupNodes.reduce(
        (groupedNodes: any, currentNode: Node) => {
          const verticalPadding = 40;

          currentNode.__rf.position = {
            x: data.currentXPosition,
            y: groupedNodes.currentYPosition,
          };

          return {
            positionedNodes: groupedNodes.positionedNodes.concat([currentNode]),
            currentYPosition:
              groupedNodes.currentYPosition + currentNode.__rf.height + verticalPadding,
          };
        },
        { positionedNodes: [], currentYPosition: 0 }
      );

      return {
        ...data,
        nodes: [...data.nodes, ...positionedNodes],
        currentXPosition: data.currentXPosition + maxWidthOfGroup + 100,
      };
    },
    { nodes: [], currentXPosition: 0 }
  );

  return newElements.nodes;
};
