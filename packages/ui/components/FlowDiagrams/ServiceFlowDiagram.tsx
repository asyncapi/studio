"use client"
import React, { ReactElement, useEffect, useMemo } from "react"
import ReactFlow, { Edge, EdgeTypes, Node, useEdgesState, useNodesState } from "reactflow"
import "reactflow/dist/style.css"

import { OperationEdge } from "./Edges/OperationEdge"
import { ServiceServerNode } from "./Nodes/ServiceServerNode"

export enum OperationAction {
  SEND = "send",
  RECEIVE = "receive",
}
interface Operation {
  id: string
  action: OperationAction
  source: string
  selected?: boolean
}

interface Server {
  id: string
  position: Point
  component: ReactElement
}

interface Point {
  x: number
  y: number
}

interface Service {
  position: Point
  component: ReactElement
}

interface ServiceFlowDiagramProps {
  operations: Operation[]
  servers: Server[]
  service: Service
  addServerButtonPosition: Point
  onServiceClick?: () => void
  onServerClick?: (serverId: string) => void
  onOperationClick?: (operationId: string) => void
  onAddServer?: () => void
  onAddOperation?: (serverId: string) => void
}

const SERVICE_SERVER = "service-server"
const OPERATION = "operation"

const CONSTANTS = {
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
  SERVICE_ID: "service",
  RECEIVE: "receive",
  SEND: "send",
}

import FloatingConnectionLine from "./ConnectionLines/FloatingConnectionLine"
import { AddIcon } from "../icons"

const nodeTypes = { [SERVICE_SERVER]: ServiceServerNode }
const edgeTypes = { operation: OperationEdge }

const ServiceFlowDiagram: React.FC<ServiceFlowDiagramProps> = ({
  operations,
  servers,
  service,
  addServerButtonPosition,
  onAddOperation,
  onAddServer,
  onOperationClick,
  onServerClick,
  onServiceClick,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    // Adding nodes for servers
    const nodes: ServiceServerNode[] = servers.map((server) => ({
      id: server.id,
      position: server.position,
      type: SERVICE_SERVER,
      data: { ui: server.component },
    }))

    // Adding the service node (there is only one service per graph)
    nodes.push({
      id: CONSTANTS.SERVICE_ID,
      position: service.position,
      type: SERVICE_SERVER,
      data: { ui: service.component },
    })

    // Adding the add "CREATE SERVER" node

    nodes.push({
      id: "server-add",
      position: addServerButtonPosition,
      type: SERVICE_SERVER,
      data: { ui: <AddIcon className="nodrag w-10 h-10 cursor-pointer" /> },
    })

    // Adding edges for operations
    const edges: OperationEdge[] = []
    servers.forEach((server) => {
      const serverOperations = operations.filter((op) => op.source === server.id)
      serverOperations.forEach((operation, index) => {
        let source = CONSTANTS.SERVICE_ID
        let target = operation.source
        const shouldReverse = operation.action === CONSTANTS.RECEIVE
        if (shouldReverse) {
          [source, target] = [target, source]
        }
        edges.push({
          id: operation.id,
          type: OPERATION,
          data: {
            operationType: operation.action,
            index: index,
            serverId: operation.source,
          },
          source,
          target,
          animated: true,
          selected: operation.selected,
          label: operation.id,
        })
      })
    })

    // Adding edges for "Add Operation"
    servers.forEach((server) => {
      const edgeIndex = operations.filter((op) => server.id === op.source).length
      edges.push({
        id: `${server.id}-add`,
        source: server.id,
        target: CONSTANTS.SERVICE_ID,
        data: {
          operationType: "receive",
          index: edgeIndex,
          serverId: server.id,
        },
        type: OPERATION,
        label: <AddIcon className="w-7 h-7" />,
        style: { strokeDasharray: 2, stroke: "#6b7280" },
      })
    })

    setNodes(nodes)
    setEdges(edges)
  }, [])

  // event handlers
  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    const operationEdge = edge as OperationEdge
    if (operationEdge.id.endsWith("-add")) {
      onAddOperation && onAddOperation(operationEdge.data.serverId)
    } else {
      onOperationClick && onOperationClick(operationEdge.id)
    }
  }

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const serviceServerNode = node as ServiceServerNode
    if (serviceServerNode.id.endsWith("-add")) {
      onAddServer && onAddServer()
    } else if (serviceServerNode.id === CONSTANTS.SERVICE_ID) {
      onServiceClick && onServiceClick()
    } else {
      onServerClick && onServerClick(serviceServerNode.id)
    }
  }

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        connectionLineComponent={FloatingConnectionLine}
        nodes={nodes}
        edges={edges}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
      />
    </div>
  )
}

export { ServiceFlowDiagram }
