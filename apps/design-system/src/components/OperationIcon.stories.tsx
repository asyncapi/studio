import { OperationIcon } from 'ui';

export default {
    component: OperationIcon,
    parameters: {
        backgrounds: {
          default: 'dark'
        }
    }
};

export const WithReplyIcon = () => <OperationIcon operation="reply" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" />;
export const SendIcon = () => <OperationIcon operation="send" />;
