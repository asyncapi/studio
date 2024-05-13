import React, { useCallback, useState, ReactElement } from 'react';
import ReactFlow, { Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { AddIcon } from '../icons';
import { OperationEdge } from './Edges';
import { ServiceServerNode } from './Nodes';

export interface FlowDiagramOperation {
  type: 'send' | 'receive';
  source: string;
  selected?: boolean;
}

export type ServerPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface FlowDiagramServer {
  id: string;
  component: ReactElement;
}

interface Point {
  x: number;
  y: number;
}

interface Service {
  position: Point;
  component: ReactElement;
}

interface ServiceFlowDiagramProps {
  operations: Map<string, FlowDiagramOperation>;
  servers: Map<ServerPlacement, FlowDiagramServer>;
  service: Service;
  onServiceClick?: () => void;
  onServerClick?: (serverId: string) => void;
  onOperationClick?: (operationId: string) => void;
  onAddServer?: () => void;
  onAddOperation?: (serverId: string) => void;
}

const SERVICE_SERVER = 'service-server';
const OPERATION = 'operation'

const edgeTypes = { [OPERATION]: OperationEdge };
const nodeTypes = { [SERVICE_SERVER]: ServiceServerNode };

const serviceServerSpacing = 200;
const serverWidth = 290;
const serverHeight = 50;

const CONSTANTS = {
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
  SERVICE_ID: "service",
  RECEIVE: "receive",
  SEND: "send",
};

const calculateServerPosition = (servicePosition: Point, serviceHeight: number, placement: ServerPlacement) => {
  const adjustX = placement.includes(CONSTANTS.RIGHT) ? serverWidth - 15 : -35;
  const adjustY = placement.includes(CONSTANTS.TOP) ? -serverHeight - serviceServerSpacing : serviceHeight + serviceServerSpacing;
  return {
    x: servicePosition.x + adjustX,
    y: servicePosition.y + adjustY
  };
};

function calculateAddServerPosition(service: Service, servers: Map<ServerPlacement, FlowDiagramServer>): Point {
  const serversAtTop = Array.from(servers.keys()).filter(key => key.includes(CONSTANTS.TOP)).length;
  return { x: service.position.x + serverWidth * serversAtTop, y: service.position.y - serviceServerSpacing - (serverHeight / 1.5 ) }
}

export const ServiceFlowDiagram: React.FC<ServiceFlowDiagramProps> = ({ operations, servers, service, onAddOperation, onAddServer, onOperationClick, onServerClick, onServiceClick }) => {
  const [serviceDimensions, setServiceDimensions] = useState({ width: 0, height: 0 });

  const measuredRef = useCallback((node: any) => {
    if (node !== null) {
      setServiceDimensions({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  }, []);

  const serviceWithRef = React.cloneElement(service.component, { ref: measuredRef });

  // Adding nodes for servers
  const nodes: ServiceServerNode[] = Array.from(servers.entries()).map(([placement, server]) => ({
    id: server.id,
    position: calculateServerPosition(service.position, serviceDimensions.height, placement),
    type: SERVICE_SERVER,
    data: { ui: server.component },
  }));

  // Adding the service node (there is only one service per graph)
  nodes.push({
    id: CONSTANTS.SERVICE_ID,
    position: service.position,
    type: SERVICE_SERVER,
    data: { ui: serviceWithRef },
  });

    // Adding the add "CREATE SERVER" node

  const addServerNode = <AddIcon className="w-10 h-10 cursor-pointer" />;
  nodes.push({
    id: "server-add",
    position: calculateAddServerPosition(service, servers),
    type: SERVICE_SERVER,
    data: { ui: addServerNode },
  });


  // Adding edges for operations
  const edges: OperationEdge[]= [];
  Array.from(servers.entries()).forEach(([placement, server]) => {
    const serverOperations = Array.from(operations.entries()).filter(([,op]) => server.id === op.source);
    serverOperations.forEach(([id, operation], index) => {
      const [placement] = Array.from(servers.entries()).find((([,server]) => server.id === operation.source)) ?? [];
      let sourceHandle = CONSTANTS.BOTTOM;
      let targetHandle = CONSTANTS.TOP;
      let source = CONSTANTS.SERVICE_ID;
      let target = operation.source;
      const isReceive = operation.type === CONSTANTS.RECEIVE;
      const isServerTop = placement?.includes(CONSTANTS.TOP);
      if (isReceive) {
        [sourceHandle, targetHandle] = [targetHandle, sourceHandle];
        [source, target] = [target, source];
      }
      if (isServerTop) {
        [sourceHandle, targetHandle] = [targetHandle, sourceHandle];
      }
      edges.push({
      id: id,
      type: OPERATION,
      data: {
        operationType: operation.type,
        index: index,
        serverId: operation.source,
      },
      source,
      target,
      sourceHandle,
      targetHandle,
      animated: true,
      selected: operation.selected,
      label: id,
    })})
  });

  // Adding edges for "Add" icon to create new operations
  servers.forEach((server, placement) => {
    const edgeIndex = Array.from(operations.values()).filter(op => server.id === op.source).length;
    let sourceHandle = CONSTANTS.BOTTOM;
    let targetHandle = CONSTANTS.TOP;
    const shouldReverse = placement.includes(CONSTANTS.BOTTOM);
    if (shouldReverse) {
      [sourceHandle, targetHandle] = [targetHandle, sourceHandle];
    }
    edges.push({
      id: `${server.id}-add`,
      source: server.id,
      target: CONSTANTS.SERVICE_ID,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      data: { 
        operationType: "receive",
        index: edgeIndex,
        serverId: server.id,
      },
      type: OPERATION,
      label: (<AddIcon className="w-7 h-7" />),
      style: { strokeDasharray: 2, stroke: "#6b7280" },
    });
  });

  // event handlers
  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    const operationEdge = edge as OperationEdge;
    if (operationEdge.id.endsWith("-add")) {
      onAddOperation && onAddOperation(operationEdge.data.serverId);
    } else {
      onOperationClick && onOperationClick(operationEdge.id);
    }
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const serviceServerNode = node as ServiceServerNode;
    if (serviceServerNode.id.endsWith("-add")) {
      onAddServer && onAddServer();
    } else if(serviceServerNode.id === CONSTANTS.SERVICE_ID) {
      onServiceClick && onServiceClick();
    } else {
      onServerClick && onServerClick(serviceServerNode.id);
    }
  };


  return (
    <div className='w-screen h-screen'>
      <ReactFlow
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
    </div>
  );
}


