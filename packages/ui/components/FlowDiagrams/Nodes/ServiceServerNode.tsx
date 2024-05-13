import { ReactNode } from "react"
import { Handle, Node,  Position } from "reactflow"

type Data = {
  ui: ReactNode
}
export type ServiceServerNode = Omit<Node, "data"> & {
  data: Data
}
export function ServiceServerNode({ data }: {data: Data}) {
  return (
    <>
      {data.ui}
      <div>
        <Handle position={Position.Bottom} id="bottom" className="opacity-0" type={"target"} />
        <Handle type={"target"} position={Position.Top} id="top" className="opacity-0" />
        <Handle position={Position.Bottom} id="bottom" className="opacity-0" type={"source"} />
        <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
      </div>
    </>
  )
}
