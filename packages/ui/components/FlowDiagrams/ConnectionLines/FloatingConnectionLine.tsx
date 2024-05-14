
// THIS FILE IS COPY-PASTED FROM: https://reactflow.dev/examples/edges/floating-edges


import React from 'react';
import { getBezierPath } from 'reactflow';

import { getEdgeParams } from '../Edges/Utils';

type FloatingConnectionLineProps = {
  toX: number;
  toY: number;
  fromPosition: string;
  toPosition: string;
  fromNode?: any;
};
function FloatingConnectionLine({ toX, toY, fromPosition, toPosition, fromNode }: FloatingConnectionLineProps) {
  if (!fromNode) {
    return null;
  }

  const targetNode = {
    id: 'connection-target',
    width: 1,
    height: 1,
    positionAbsolute: { x: toX, y: toY }
  };

  const { sx, sy } = getEdgeParams(fromNode, targetNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    // @ts-ignore
    sourcePosition: fromPosition,
    // @ts-ignore
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY
  });

  return (
    <g>
    <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
    />
    <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
    />
  </g>
  );

}

export default FloatingConnectionLine;
