import { useEffect } from 'react';
import ReactFlow, { Controls as FlowControls, Background, BackgroundVariant, useReactFlow, useStore, useNodesState, useEdgesState, useNodes } from 'reactflow';

import NodeTypes from './Nodes';
import { Controls } from './Controls';
import { getElementsFromAsyncAPISpec } from './utils/node-factory';
import { calculateNodesForDynamicLayout } from './utils/node-calculator';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';
import type { FunctionComponent } from 'react';

interface FlowDiagramProps {
  parsedSpec: AsyncAPIDocument;
}

interface AutoLayoutProps {}

const AutoLayout: FunctionComponent<AutoLayoutProps> = () => {
  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const setNodes = useStore(state => state.setNodes);

  useEffect(() => {
    if (nodes.length === 0 || !nodes[0].width) {
      return;
    }

    const nodesWithOrginalPosition = nodes.filter(node => node.position.x === 0 && node.position.y === 0);
    if (nodesWithOrginalPosition.length > 1) {
      const calculatedNodes = calculateNodesForDynamicLayout(nodes);
      setNodes(calculatedNodes);
      fitView();
    }
  }, [nodes]);

  return null;
};

export const FlowDiagram: FunctionComponent<FlowDiagramProps> = ({ parsedSpec }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-gray-200" />
        <AutoLayout />
        <Controls  />
        <div className="-mt-20">
          <FlowControls style={{ bottom: '95px' }} className='bg-white' />
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
