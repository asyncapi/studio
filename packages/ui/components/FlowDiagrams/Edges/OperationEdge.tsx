import { BaseEdge, Edge as ReactFlowEdge, EdgeLabelRenderer, EdgeProps, getStraightPath, useEdges } from "reactflow"
import EdgeTextLabel from './OperationEdgeTextLabel'
import EdgeButtonLabel from './OperationEdgeButtonLabel'



export type OperationEdge = Omit<ReactFlowEdge, 'data'> & {
  data: {
    index: number
    operationType: "send" | "receive",
    serverId: string
  }
}


const EDGE_SPACING = 20

const calculateEdgeOffset = (index: number, numberOfEdges: number) => {
  const centerOffset = (numberOfEdges - 1) * EDGE_SPACING / 2
  return index * EDGE_SPACING - centerOffset
}

const doesBelongToTheCurrentGroup = (edge: ReactFlowEdge, source: any, target: any) => 
  (edge.source === source && edge.target === target) || 
  (edge.source === target && edge.target === source)


export function OperationEdge({ sourceX, targetX, sourceY, targetY, selected, style, label, target, source, data, ...rest }: EdgeProps) {
  const index = data.index
  const numberOfEdges = useEdges().filter(edge => doesBelongToTheCurrentGroup(edge, source, target)).length
  const offset = calculateEdgeOffset(index, numberOfEdges)
  const X = data.operationType && data.operationType  === "receive" ? sourceX + offset : targetX + offset
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: X,
    sourceY,
    targetX: X,
    targetY,
  })

  const color = selected ? "#ec4899" : "#cbd5e1"
  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: color, ...style }} {...rest} />
      <EdgeLabelRenderer>
        {typeof label === "string" 
          ? <EdgeTextLabel selected={selected} label={label} labelX={labelX} labelY={labelY} /> 
          : <EdgeButtonLabel label={label} labelX={labelX} labelY={labelY} />
        }
      </EdgeLabelRenderer>
    </>
  )
}
