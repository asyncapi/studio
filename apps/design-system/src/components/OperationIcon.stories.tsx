import { OperationIcon } from 'ui';

export default {
  title: 'OperationIcon',
  component: OperationIcon,
};

export const WithReplyIcon = (args) => <OperationIcon {...args} />;
WithReplyIcon.args = {
  type: 'withReply',
  className: 'fill-current text-gray-500',
};

export const ReceiveIcon = (args) => <OperationIcon {...args} />;
ReceiveIcon.args = {
  type: 'receive',
  className: 'fill-current text-gray-500',
};

export const SendIcon = (args) => <OperationIcon {...args} />;
SendIcon.args = {
  type: 'send',
  className: 'fill-current text-gray-500',
};
