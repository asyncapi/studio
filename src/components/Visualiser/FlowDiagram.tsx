import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Controls as FlowControls, Background, BackgroundVariant, useReactFlow, useStore, useNodesState, useEdgesState, useNodes, useEdges } from 'reactflow';

import { Controls } from './Controls';
import NodeTypes from './Nodes';
import { getElementsFromAsyncAPISpec } from './utils/node-factory';
import { calculateNodesForDynamicLayout } from './utils/node-calculator';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';
import type { FunctionComponent, PropsWithChildren } from 'react';
import type { ReactFlowInstance } from 'reactflow';

interface FlowDiagramProps {
  parsedSpec: AsyncAPIDocument;
}

interface AutoLayoutProps extends PropsWithChildren {
  elementsToRenderNumber: number;
}

const AutoLayout: FunctionComponent<AutoLayoutProps> = ({ elementsToRenderNumber }) => {
  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  const setNodes = useStore(state => state.setNodes);

  const rerender = () => {
    const calculatedNodes = calculateNodesForDynamicLayout(nodes);
    setNodes(calculatedNodes);
    fitView();
  };

  useEffect(() => {
    if (elementsToRenderNumber === (nodes.length + edges.length)) {
      // stop overlap no nodes when re-render, recalculate where they should go
      const nodesWithOrginalPosition = nodes.filter(node => node.position.x === 0 && node.position.y === 0);
      if (nodesWithOrginalPosition.length > 1) {
        setTimeout(() => {
          rerender();
        }, 1);
      }
    }
  }, [nodes]);

  return null;
};

export const FlowDiagram: FunctionComponent<FlowDiagramProps> = ({ parsedSpec }) => {
  const [loaded, setLoaded] = useState(false);

  const elements = getElementsFromAsyncAPISpec(parsedSpec);
  const _nodes = elements.map(el => el.node).filter(Boolean);
  const _edges = elements.map(el => el.edge).filter(Boolean);

  const [nodes, setNodes, onNodesChange] = useNodesState(_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(_edges);
    
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setLoaded(true);
    instance.fitView();
  }, []);

  useEffect(() => {
    const elements = getElementsFromAsyncAPISpec(parsedSpec);
    const newNodes = elements.map(el => el.node).filter(Boolean);
    const newEdges = elements.map(el => el.edge).filter(Boolean);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [parsedSpec]);

  return (
    <div className="h-screen bg-gray-800 relative">
      <ReactFlow 
        nodeTypes={NodeTypes} 
        nodes={nodes} 
        edges={edges} 
        minZoom={0.1} 
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background color="#d1d1d3" variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-gray-200" />
        {loaded && <AutoLayout elementsToRenderNumber={nodes.length + edges.length} />}
        <Controls  />
        <div className="-mt-20">
          <FlowControls style={{ bottom: '105px' }} />
        </div>
      </ReactFlow>
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Event Visualiser</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">{parsedSpec.info().title()}</span>
      </div>
    </div>
  );
};
