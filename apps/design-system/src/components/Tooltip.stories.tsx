import React from 'react'
import { Tooltip } from '@asyncapi/studio-ui'

export default {
  component: Tooltip.Content,
  decorators: [
    (Story: React.FC) => (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <button className="text-white">Hover me!</button>
          </Tooltip.Trigger>
          <Story />
        </Tooltip.Root>
      </Tooltip.Provider>
    )
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  },
}

export const Default = {
  render: () => <Tooltip.Content side="bottom">Look ma! I'm a tooltip!</Tooltip.Content>
};

