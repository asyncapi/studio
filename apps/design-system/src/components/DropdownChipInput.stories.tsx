import { Meta, StoryObj } from '@storybook/react';
import { DropdownChipInput } from '@asyncapi/studio-ui'; 
import { useState } from 'react';

const meta: Meta<typeof DropdownChipInput> = {
  component: DropdownChipInput,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  }
}
export default meta;


type Story = StoryObj<typeof DropdownChipInput>

const OPTIONS = ["string", "number", "boolean", "object", "array", "null"];

export const Default: Story = {
  render: function Render() {
    const [currentChips, setCurrentChips] = useState<string[]>(["boolean"]);
    return (
        <DropdownChipInput 
        className='w-96'
        id="chip-input-id-chip-text"
        chips={currentChips}
        onChange={setCurrentChips} 
        chipsOptions={OPTIONS}/>
      )
    }
}


export const Disabled: Story = {
  render: function Render() {
    const [currentChips, setCurrentChips] = useState<string[]>(["string"]);
    return (
        <DropdownChipInput 
        className='w-96'
        id="chip-input-id-chip-text"
        chips={currentChips}
        onChange={setCurrentChips} 
        isDisabled={true}
        chipsOptions={OPTIONS}/>
      )
    }
}

export const WithPlaceholder: Story = {
  render: function Render() {
    const [currentChips, setCurrentChips] = useState<string[]>([]);
    return (
        <DropdownChipInput 
        className='w-96'
        placeholder='Add a chip'
        id="chip-input-id-chip-text"
        chips={currentChips}
        onChange={setCurrentChips} 
        chipsOptions={OPTIONS}/>
      )
    }
}
