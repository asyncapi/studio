import { useState } from "react";
import { ChipInput } from "@asyncapi/studio-ui";

const meta = {
  component: ChipInput,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light'
    }
  },
};

export default meta;

export const Default = () => {
  const [currentChips, setCurrentChips] = useState(['production', 'plateform']);

  return (
    <div className="p-4 bg-gray-100 flex items-center">
      <ChipInput 
        name="chip-input" 
        id="chip-input-id" 
        chips={currentChips} 
        onChange={setCurrentChips} 
      />
    </div>
  );
};
