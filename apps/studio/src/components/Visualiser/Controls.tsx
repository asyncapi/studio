import { useState, useEffect } from 'react';
import { useStore, useReactFlow, useNodes, useEdges } from 'reactflow';
import { VscDebugStart, VscDebugPause, VscRefresh } from 'react-icons/vsc';

import { calculateNodesForDynamicLayout } from './utils/node-calculator';

import type { FunctionComponent } from 'react';

interface ControlsProps {}

export const Controls: FunctionComponent<ControlsProps> = () => {
  const [animateNodes, setAnimateNodes] = useState(false);

  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();
  const setNodes = useStore(state => state.setNodes);
  const setEdges = useStore(state => state.setEdges);

  useEffect(() => {
    if (nodes.length > 0) {
      const newNodeEdges = edges.map(edge => ({ ...edge, animated: animateNodes }));
      setEdges([...newNodeEdges]);
    } 
  }, [animateNodes]);

  const reloadInterface = () => {
    setNodes(calculateNodesForDynamicLayout(nodes));
    fitView();
  };

  return (
    <div className="absolute top-0 right-0 mr-5 mt-5 rounded-lg bg-white z-20 space-x-10 px-4 pt-1 shadow-lg">
      <button type="button" className="text-xs" onClick={() => setAnimateNodes(!animateNodes)}>
        {animateNodes && <VscDebugPause className="w-4 h-4" />}
        {!animateNodes && <VscDebugStart className="w-4 h-4" />}
      </button>
      <button type="button" className="text-xs" onClick={reloadInterface}>
        <VscRefresh className="w-4 h-4" />
      </button>
    </div>
  );
};
