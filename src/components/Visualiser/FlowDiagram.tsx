import React, { useState, useEffect } from 'react';
import ReactFlow, { useStoreActions, useStoreState, Background, useZoomPanHelper, Node, BackgroundVariant } from 'react-flow-renderer';
import { AsyncAPIDocument } from '@asyncapi/parser';
import nodeTypes from './Nodes';
import { getElementsFromAsyncAPISpec, getNodesForAutoLayout } from './utils/asyncapi-flow';

interface FlowDiagramProps {
  parsedSpec: AsyncAPIDocument;
}
interface AutoLayoutProps {
  parsedSpec: AsyncAPIDocument;
}

const AutoLayout: React.FunctionComponent<AutoLayoutProps> = ({ parsedSpec }) => {
  const [loaded, setLoaded] = useState(false);

  const nodeHasWidth = (node: Node) => {
    return node.__rf && !!node.__rf.width;
  };

  // // react-flow data
  const nodeStates = useStoreState((store) => store.nodes);
  const nodeEdges = useStoreState((store) => store.edges);
  const setElements = useStoreActions((actions) => actions.setElements);
  const { fitView } = useZoomPanHelper();

  // We can only calculate real node positions once they are rendered to the dom at least once
  useEffect(() => {
    if (!loaded && nodeStates.length > 0 && nodeHasWidth(nodeStates[0])) {
      const calculatedNodes = getNodesForAutoLayout(nodeStates);
      setElements([...calculatedNodes, ...nodeEdges]);
      fitView();
      setLoaded(true);
    }
  }, [nodeStates, loaded]);

  return null;
};

export const FlowDiagram: React.FunctionComponent<FlowDiagramProps> = ({ parsedSpec }) => {
  const title = parsedSpec.info().title();
  const version = parsedSpec.info().version();

  const elements = getElementsFromAsyncAPISpec(parsedSpec);

  return (
    <div className="h-screen bg-gray-200">
      <h2 className="text-3xl p-4">
        {title} {version}
      </h2>
      <ReactFlow nodeTypes={nodeTypes} elements={elements}>
        <Background color="#d1d1d3" variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-gray-200" />
        <AutoLayout parsedSpec={parsedSpec} />
      </ReactFlow>
    </div>
  );
};
