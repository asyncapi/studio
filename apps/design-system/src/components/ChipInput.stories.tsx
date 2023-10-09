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
  const [currentChips, setCurrentChips] = useState<string[]>([]);
  
  return (
    <div className="p-4 bg-gray-100 flex items-center">
      <ChipInput 
        name="chip-input-default" 
        id="chip-input-id-default" 
        chips={currentChips} 
        onChange={setCurrentChips}
      />
    </div>
  );
};

export const WithTags = () => {
    const [currentChips, setCurrentChips] = useState<string[]>(['production', 'platform']);
    
    return (
      <div className="p-4 bg-gray-100 flex items-center">
        <ChipInput 
          name="chip-input-chip-text" 
          id="chip-input-id-chip-text" 
          chips={currentChips} 
          onChange={setCurrentChips}
        />
      </div>
    );
  };
  
export const WithSomeDefaultText = () => {
  const [currentChips, setCurrentChips] = useState<string[]>(['production', 'platform']);

  return (
    <div className="p-4 bg-gray-100 flex items-center">
      <ChipInput 
        name="chip-input-default-text-in-input" 
        id="chip-input-id-default-text-in-input" 
        chips={currentChips} 
        onChange={setCurrentChips}
        defaultValue="registr"
      />
    </div>
  );
};

export const WithCustomPlaceholder = () => {
  const [currentChips, setCurrentChips] = useState<string[]>([]);
  
  return (
    <div className="p-4 bg-gray-100 flex items-center">
      <ChipInput 
        name="chip-input-custom-placeholder" 
        id="chip-input-id-placeholder" 
        chips={currentChips} 
        onChange={setCurrentChips}
        placeholder="Enter a custom chip"
      />
    </div>
  );
};
