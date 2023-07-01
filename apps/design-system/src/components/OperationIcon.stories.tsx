import { OperationIcon } from 'ui';

export default {
    title: 'Components/OperationIcon',
    component: OperationIcon,
};

export const WithReplyIcon = () => <OperationIcon operation="reply" className="w-7 h-7 fill-current text-gray-500" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" className="w-7 h-7 fill-current text-gray-500" />;
export const SendIcon = () => <OperationIcon operation="send" className="w-7 h-7 fill-current text-gray-500" />;
