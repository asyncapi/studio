import { OperationIcon } from '@asyncapi/studio-ui';

const meta = {
  component: OperationIcon,
  parameters: {
      backgrounds: {
        default: 'dark'
      }
  }
};

export default meta;
export const WithReplyIcon = () => <OperationIcon operation="reply" />;
export const ReceiveIcon = () => <OperationIcon operation="receive" />;
export const SendIcon = () => <OperationIcon operation="send" />;
