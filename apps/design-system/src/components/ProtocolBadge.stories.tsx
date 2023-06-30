/* eslint-disable import/no-anonymous-default-export */
import { ProtocolBadge } from 'ui';

export default {
  component: ProtocolBadge,
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
};

export const Default = {
  args: {
    protocol: 'http'
  }
};
