import { useState, KeyboardEvent, FunctionComponent } from 'react';

interface ChipInputProps {
  initialChips?: string[];
  initialInputValue?: string;
}

export const ChipInput: FunctionComponent<ChipInputProps> = ({ 
  initialChips = [], 
  initialInputValue = 'registr' 
}) => {
  const [chips, setChips] = useState<string[]>(initialChips);
  const [inputValue, setInputValue] = useState<string>(initialInputValue);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setChips((prevChips) => [...prevChips, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (chipToDelete: string) => () => {
    setChips((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <div className="flex flex-wrap items-center p-2 bg-gray-900 rounded">
      <div className="w-full text-gray-100 mb-2">Tags</div>
      {chips.map((chip) => (
        <div key={chip} className="m-1 bg-gray-100 border-0.5 border-gray-400 text-gray-900 rounded px-3 py-1 flex items-center relative">
          <span className="mr-3">{chip}</span>
          <button 
            onClick={handleDelete(chip)} 
            className="text-gray-900 absolute top-1/2 transform -translate-y-1/2 right-2 focus:outline-none"
            style={{ fontSize: '18px' }}
          >×</button>
        </div>
      ))}
      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="p-1 bg-gray-900 text-white rounded outline-none"
        placeholder="Add a chip"
      />
    </div>
  );
};
