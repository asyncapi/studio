import {
  BaseEdge,
  Edge as ReactFlowEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useEdges,
  useStore,
  getBezierPath,
  Position,
} from "reactflow"
import EdgeTextLabel from "./OperationEdgeTextLabel"
import EdgeButtonLabel from "./OperationEdgeButtonLabel"
import { useCallback } from "react"
import { getEdgeParams } from "./Utils"

export type OperationEdge = Omit<ReactFlowEdge, "data"> & {
  data: {
    index: number
    operationType: "send" | "receive"
    serverId: string
  }
}

const EDGE_SPACING = 20

const calculateEdgeOffset = (index: number, numberOfEdges: number) => {
  const centerOffset = ((numberOfEdges - 1) * EDGE_SPACING) / 2
  return index * EDGE_SPACING - centerOffset
}

const isOppositePosition = (sourcePos: Position, targetPos: Position) => {
  const opposites = {
    [Position.Top]: Position.Bottom,
    [Position.Bottom]: Position.Top,
    [Position.Left]: Position.Right,
    [Position.Right]: Position.Left,
  }

  return opposites[sourcePos] === targetPos
}

const doesBelongToTheCurrentGroup = (edge: ReactFlowEdge, source: any, target: any) =>
  (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source)

const getMiddleEdgeParams = ({ sx, sy, tx, ty, sourcePos, targetPos }: any, offset: number, operationType: string) => {
  const fromNodeOffset = 50
  let offsetX = offset,
    offsetY = 0,
    offsetSX = 0,
    offsetSY = 0,
    offsetTX = 0,
    offsetTY = 0

  const isSendOperation = operationType === "send"
  const relevantPos = isSendOperation ? sourcePos : targetPos

  // Determine offset direction based on position
  switch (relevantPos) {
    case Position.Top:
      offsetSY += fromNodeOffset * (isSendOperation ? -1 : 1)
      offsetTY += fromNodeOffset * (isSendOperation ? 1 : -1)
      break
    case Position.Bottom:
      offsetSY += fromNodeOffset * (isSendOperation ? 1 : -1)
      offsetTY += fromNodeOffset * (isSendOperation ? -1 : 1)
      break
    case Position.Left:
      offsetSX += fromNodeOffset * (isSendOperation ? -1 : 1)
      offsetTX += fromNodeOffset * (isSendOperation ? 1 : -1)
      offsetX = 0
      offsetY = offset
      break
    case Position.Right:
      offsetSX += fromNodeOffset * (isSendOperation ? 1 : -1)
      offsetTX += fromNodeOffset * (isSendOperation ? -1 : 1)
      offsetX = 0
      offsetY = offset
      break
  }

  return {
    sx: sx + offsetSX + offsetX,
    sy: sy + offsetSY + offsetY,
    tx: tx + offsetTX + offsetX,
    ty: ty + offsetTY + offsetY,
    sourcePos,
    targetPos,
  }
}

export function OperationEdge({
  sourceX,
  targetX,
  sourceY,
  targetY,
  selected,
  style,
  label,
  target,
  source,
  data,
  ...rest
}: EdgeProps): JSX.Element | null {
  // // Fetch nodes associated with the source and target from the state store.
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]))
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]))

  // Calculate offset and a percentage of it for positioning the edge.
  const numberOfEdges = useEdges().filter((edge) => doesBelongToTheCurrentGroup(edge, source, target)).length
  const offset = calculateEdgeOffset(data.index, numberOfEdges)
  const TenPercentOfOffset = offset * 0.1

  if (!sourceNode || !targetNode) {
    return null
  }

  let { tx, ty, sx, sy, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode)

  if (!isOppositePosition(sourcePos, targetPos)) return null

  // Determine operation characteristics: send operation and orientation.
  const isSendOperation = data.operationType === "send"
  const isHorizontal = sourcePos === Position.Right || sourcePos === Position.Left
  if (isSendOperation)
    if (isHorizontal) {
      ty += TenPercentOfOffset
      sy = ty
    } else {
      tx += TenPercentOfOffset
      sx = tx
    }
  else if (isHorizontal) {
    sy += TenPercentOfOffset
    ty = sy
  } else {
    sx += TenPercentOfOffset
    tx = sx
  }

  const middleEdgeParams = getMiddleEdgeParams({ sx, sy, tx, ty, sourcePos, targetPos }, offset, data.operationType)

  // Use Bezier and straight paths to draw the edge.
  const [targetPath, sourcePath, edgePath, labelX, labelY] = constructEdgePaths(middleEdgeParams, tx, ty, sx, sy)

  const color = selected ? "#ec4899" : "#cbd5e1"
  const orientation =
    middleEdgeParams.sourcePos === Position.Top || middleEdgeParams.targetPos === Position.Top
      ? "vertical"
      : "horizontal"

  return (
    <>
      <BaseEdge
        path={`${sourcePath} ${edgePath} ${targetPath}`}
        style={{ stroke: color, ...style }}
        {...rest}
      />
      <EdgeLabelRenderer>
        {typeof label === "string" ? (
          <EdgeTextLabel
            selected={selected}
            label={label}
            labelX={labelX as number}
            labelY={labelY as number}
            orientation={orientation}
          />
        ) : (
          <EdgeButtonLabel label={label} labelX={labelX as number} labelY={labelY as number} />
        )}
      </EdgeLabelRenderer>
    </>
  )
}

function constructEdgePaths(middleEdgeParams: any, tx: number, ty: number, sx: number, sy: number) {
  const [targetPath] = getBezierPath({
    sourceX: middleEdgeParams.tx,
    sourceY: middleEdgeParams.ty,
    sourcePosition: middleEdgeParams.sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: middleEdgeParams.targetPos,
  })

  const [sourcePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: middleEdgeParams.sourcePos,
    targetX: middleEdgeParams.sx,
    targetY: middleEdgeParams.sy,
    targetPosition: middleEdgeParams.targetPos,
  })

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: middleEdgeParams.sx,
    sourceY: middleEdgeParams.sy,
    targetX: middleEdgeParams.tx,
    targetY: middleEdgeParams.ty,
  })
  return [targetPath, sourcePath, edgePath, labelX, labelY]
}
