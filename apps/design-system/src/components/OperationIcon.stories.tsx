import { OperationIcon } from 'ui';

export default {
    component: OperationIcon,
};

export const WithReplyIcon = () => <OperationIcon operation="reply" className="w-7 h-7" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" className="w-7 h-7" />;
export const SendIcon = () => <OperationIcon operation="send" className="w-7 h-7" />;
