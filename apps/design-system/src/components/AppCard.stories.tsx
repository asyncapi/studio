import { StoryObj, Meta } from '@storybook/react'

import { AppCard } from '@asyncapi/studio-ui'

const meta: Meta<typeof AppCard> = {
  component: AppCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  },
}

export default meta
type Story = StoryObj<typeof AppCard>
export const CodeEditor: Story = {
  args: {
    isActive: true,
    name: 'User Registration',
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur",
    badges: ['http', 'kafka', 'websocket'],
    isServer: true,
    isClient: false
  },
}