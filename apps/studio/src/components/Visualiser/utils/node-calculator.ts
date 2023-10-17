import { isNode, Node } from 'reactflow';

const groupNodesByColumn = (elements: Node[]) => {
  return elements.reduce((elementsGrouped: any, element: Node) => {
    if (isNode(element)) {
      if (elementsGrouped[element?.data.columnToRenderIn]) {
        return {
          ...elementsGrouped,
          [element.data.columnToRenderIn]: elementsGrouped[element?.data.columnToRenderIn].concat([element])};
      }
      
      return {
        ...elementsGrouped,
        [element.data.columnToRenderIn]: (elementsGrouped[element?.data.groupId] = [element]),
      };
    }
    return elementsGrouped;
  }, {});
};

export const calculateNodesForDynamicLayout = (elements: Node[]) => {
  const elementsGroupedByColumn = groupNodesByColumn(elements);

  const newElements: { nodes: Node[], currentXPosition: number } = Object.keys(elementsGroupedByColumn).reduce(
    (data: { nodes: Node[], currentXPosition: number }, group: string) => {
      const groupNodes = elementsGroupedByColumn[String(group)];

      // eslint-disable-next-line
      const maxWidthOfColumn = Math.max.apply(
        Math,
        groupNodes.map((o: Node) => {
          return o.width;
        })
      );

      // For each group (column), render the nodes based on height they require (with some padding)
      const { positionedNodes } = groupNodes.reduce(
        (groupedNodes: { positionedNodes: Node[], currentYPosition: number }, currentNode: Node) => {
          const verticalPadding = 40;

          currentNode.position.x = data.currentXPosition;
          currentNode.position.y = groupedNodes.currentYPosition;

          return {
            positionedNodes: groupedNodes.positionedNodes.concat([currentNode]),
            currentYPosition: groupedNodes.currentYPosition + (currentNode.height || 0) + verticalPadding,
          };
        },
        { positionedNodes: [], currentYPosition: 0 }
      );

      return {
        nodes: [...data.nodes, ...positionedNodes],
        currentXPosition: data.currentXPosition + maxWidthOfColumn + 100,
      };
    },
    { nodes: [], currentXPosition: 0 }
  );

  return newElements.nodes;
};
