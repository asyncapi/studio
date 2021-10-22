import React, { useState, useEffect } from 'react';
import ReactFlow,  { Controls as FlowControls, useStoreActions, useStoreState, Background, useZoomPanHelper, Node, BackgroundVariant } from 'react-flow-renderer';
import { AsyncAPIDocument } from '@asyncapi/parser';

import { Controls } from './Controls';
import nodeTypes from './Nodes';
import { getElementsFromAsyncAPISpec } from './utils/node-factory';
import { calculateNodesForDynamicLayout } from './utils/node-calculator';

interface FlowDiagramProps {
  parsedSpec: AsyncAPIDocument;
}
interface AutoLayoutProps {
  parsedSpec: AsyncAPIDocument;
}

const AutoLayout: React.FunctionComponent<AutoLayoutProps> = () => {
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
      const calculatedNodes = calculateNodesForDynamicLayout(nodeStates);
      setElements([...calculatedNodes, ...nodeEdges]);
      fitView();
      setLoaded(true);
    }
  }, [nodeStates, loaded]);

  // useEffect(() => {
  //   const calculatedNodes = calculateNodesForDynamicLayout(nodeStates);
  //   setElements([...calculatedNodes, ...nodeEdges]);
  //   fitView();
  // }, [parsedSpec]);

  return null;
};

export const FlowDiagram: React.FunctionComponent<FlowDiagramProps> = ({ parsedSpec }) => {
  const title = parsedSpec.info().title();

  const elements = getElementsFromAsyncAPISpec(parsedSpec);

  return (
    <div className="h-screen bg-gray-800">
      <ReactFlow nodeTypes={nodeTypes} elements={elements} minZoom={0.1}>
        <Background color="#d1d1d3" variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-gray-200" />
        <AutoLayout parsedSpec={parsedSpec} />
        <Controls />
        <div className="-mt-20">
          <FlowControls style={{ bottom: '80px'}} />
        </div>
      </ReactFlow>
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Event Visualiser</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">{title}</span>
      </div>
    </div>
  );
};
