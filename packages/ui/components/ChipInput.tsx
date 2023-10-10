import { FunctionComponent, KeyboardEvent, useRef } from 'react';

interface ChipInputProps {
  name: string;
  id: string;
  className?: string;
  chips: string[];
  onChange: (chips: string[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export const ChipInput: FunctionComponent<ChipInputProps> = ({
  name,
  id,
  className,
  chips,
  onChange,
  isDisabled = false,
  placeholder = 'Add Tags',
  defaultValue = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstChipRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      onChange([...chips, event.currentTarget.value.trim()]);
      event.currentTarget.value = '';
    } else if (event.key === 'Backspace' && !event.currentTarget.value) {
      onChange(chips.slice(0, -1));
    } else if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      firstChipRef.current?.focus();
    }
  };

  const handleChipKeyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Backspace') {
      const updatedChips = [...chips];
      updatedChips.splice(index, 1);
      onChange(updatedChips);
    }
  };

  const handleDelete = (chipToDelete: string) => () => {
    const updatedChips = chips.filter(chip => chip !== chipToDelete);
    onChange(updatedChips);
  };

  return (
    <div className={`${className} flex flex-wrap items-center p-1 bg-gray-900 rounded border-2 border-gray-700 h-12`}>
      {chips.map((chip, index) => (
        <div 
          key={chip} 
          className="m-1 bg-gray-800 text-white rounded px-2 py-1 flex items-center" 
          tabIndex={0} 
          onKeyDown={handleChipKeyDown(index)}
          ref={index === 0 ? firstChipRef : undefined}
        >
          <span>{chip}</span>
          <button onClick={handleDelete(chip)} tabIndex={-1} className="ml-1 text-gray-400 focus:outline-none">×</button>
        </div>
      ))}
      <input
        ref={inputRef}
        name={name}
        id={id}
        type="text"
        onKeyDown={handleKeyDown}
        className="p-1 bg-gray-900 text-white rounded outline-none"
        placeholder={placeholder}
        disabled={isDisabled}
        defaultValue={defaultValue}
      />
    </div>
  );
};
