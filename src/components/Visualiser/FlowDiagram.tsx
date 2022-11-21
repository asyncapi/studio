import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls as FlowControls, useStoreActions, useStoreState, Background, useZoomPanHelper, BackgroundVariant } from 'react-flow-renderer';

import { Controls } from './Controls';
import nodeTypes from './Nodes';
import { getElementsFromAsyncAPISpec } from './utils/node-factory';
import { calculateNodesForDynamicLayout } from './utils/node-calculator';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';

interface FlowDiagramProps {
  parsedSpec: AsyncAPIDocument;
}
interface AutoLayoutProps {
  elementsToRender: any;
}

const AutoLayout: React.FunctionComponent<AutoLayoutProps> = ({ elementsToRender }) => {
  const nodeStates = useStoreState((store) => store.nodes);
  const nodeEdges = useStoreState((store) => store.edges);
  const setElements = useStoreActions((actions) => actions.setElements);
  const { fitView } = useZoomPanHelper();
  const nodesAndEdges = [...nodeStates, ...nodeEdges];

  const rerender = () => {
    const calculatedNodes = calculateNodesForDynamicLayout(nodeStates);
    setElements([...calculatedNodes, ...nodeEdges]);
    fitView();
  };

  useEffect(() => {
    if (elementsToRender.length === nodesAndEdges.length) {
      // stop overlap no nodes when re-render, recalculate where they should go
      const nodesWithOrginalPosition = nodeStates.filter(node => node.__rf.position.x === 0 && node.__rf.position.y === 0);
      if (nodesWithOrginalPosition.length > 1) {
        setTimeout(() => {
          rerender();
        }, 1);
      }
    }
  }, [nodeStates]);

  return null;
};

export const FlowDiagram: React.FunctionComponent<FlowDiagramProps> = ({ parsedSpec }) => {
  const [loaded, setLoaded] = useState(false);
  const title = parsedSpec.info().title();

  const elements = getElementsFromAsyncAPISpec(parsedSpec);

  const handleLoaded = (reactFlowInstance: any) => {
    setLoaded(true);
    reactFlowInstance.fitView();
  };

  return (
    <div className="h-screen bg-gray-800 relative">
      <ReactFlow nodeTypes={nodeTypes} elements={elements} minZoom={0.1} onLoad={handleLoaded}>
        <Background color="#d1d1d3" variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-gray-200" />
        {loaded && <AutoLayout elementsToRender={elements} />}
        <Controls />
        <div className="-mt-20">
          <FlowControls style={{ bottom: '105px' }} />
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
