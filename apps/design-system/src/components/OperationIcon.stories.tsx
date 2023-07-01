import { OperationIcon } from 'ui';

export default {
<<<<<<< HEAD
    component: OperationIcon,
};

export const WithReplyIcon = () => <OperationIcon operation="reply" className="w-7 h-7" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" className="w-7 h-7" />;
export const SendIcon = () => <OperationIcon operation="send" className="w-7 h-7" />;
=======
  title: 'OperationIcon',
  component: OperationIcon,
};

<<<<<<< HEAD
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
>>>>>>> d02c281 (feat: initial draft for operation icon)
=======
export const WithReplyIcon = () => <OperationIcon operation="reply" className="w-7 h-7 fill-current text-gray-500" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" className="w-7 h-7 fill-current text-gray-500" />;
export const SendIcon = () => <OperationIcon operation="send" className="w-7 h-7 fill-current text-gray-500" />;
>>>>>>> 1061258 (fix: made changes)
