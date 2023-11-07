import PublishNode from './PublishNode';
import ApplicationNode from './ApplicationNode';
import SubscribeNode from './SubscribeNode';

const nodeTypes = {
  publishNode: PublishNode,
  subscribeNode: SubscribeNode,
  applicationNode: ApplicationNode
};

export default nodeTypes;