import { isNode, Node } from 'react-flow-renderer';

const groupNodesByColumn = (elements: Node[]) => {
  return elements.reduce((elementsGrouped: any, element: Node) => {
    if (isNode(element) && element.__rf) {
      return {
        ...elementsGrouped,
        [element.data.columnToRenderIn]: elementsGrouped[element?.data.columnToRenderIn] ? elementsGrouped[element?.data.columnToRenderIn].concat([element]) : (elementsGrouped[element?.data.groupId] = [element]),
      };
    }
    return elementsGrouped;
  }, {});
};

export const calculateNodesForDynamicLayout = (elements: Node[]) => {
  const elementsGroupedByColumn = groupNodesByColumn(elements);

  const newElements: { nodes: Node[], currentXPosition: number } = Object.keys(elementsGroupedByColumn).reduce(
    (data: any, group: string) => {
      const groupNodes = elementsGroupedByColumn[String(group)];

      // eslint-disable-next-line
      const maxWidthOfColumn = Math.max.apply(
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
            currentYPosition: groupedNodes.currentYPosition + currentNode.__rf.height + verticalPadding,
          };
        },
        { positionedNodes: [], currentYPosition: 0 }
      );

      return {
        ...data,
        nodes: [...data.nodes, ...positionedNodes],
        currentXPosition: data.currentXPosition + maxWidthOfColumn + 100,
      };
    },
    { nodes: [], currentXPosition: 0 }
  );

  return newElements.nodes;
};
