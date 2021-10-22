import React, { useState, useEffect } from 'react';

import { VscDebugStart, VscDebugPause  } from 'react-icons/vsc';
import { useStoreActions, useStoreState } from 'react-flow-renderer';

interface ControlsProps {}

export const Controls: React.FunctionComponent<ControlsProps> = () => {
  const [animateNodes, setAnimateNodes] = useState(false);

  const nodeStates = useStoreState((store) => store.nodes);
  const nodeEdges = useStoreState((store) => store.edges);
  const setElements = useStoreActions((actions) => actions.setElements);

  useEffect(() => {
    if (nodeStates.length > 0) {
      const newNodeEdges = nodeEdges.map(nodeEdge => ({...nodeEdge, animated: animateNodes}));
      setElements([...nodeStates, ...newNodeEdges]);
    } 
  }, [animateNodes]);

  return (
    <div className="absolute top-0 right-0 mr-5 mt-5 rounded-lg bg-white z-20 space-x-10 px-4 pt-1 shadow-lg">
      <button type="button" className="text-xs" onClick={() => setAnimateNodes(!animateNodes)}>
        {animateNodes && <VscDebugPause className="w-4 h-4" />}
        {!animateNodes && <VscDebugStart className="w-4 h-4" />}
      </button>
    </div>
  );
};
