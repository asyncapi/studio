import { Meta } from '@storybook/react';
import { IconButton } from '@asyncapi/studio-ui'; 
import { AddIcon } from '@asyncapi/studio-ui/icons'; 


const meta: Meta<typeof IconButton> = {
  component: IconButton,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta;

export const Default = () => <IconButton icon={AddIcon} />
export const WithText = () => <IconButton icon={AddIcon} text="Click Me" />;
export const WithClickEvent = () => <IconButton icon={AddIcon} onClick={() => alert('Button clicked!')} />