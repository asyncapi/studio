import { FunctionComponent, KeyboardEvent, useRef } from 'react';
import { Chip } from './Chip';

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

  const handleDelete = (chipToDelete: string) => {
    const updatedChips = chips.filter(chip => chip !== chipToDelete);
    onChange(updatedChips);
  };

  return (
    <div className={`${className} flex flex-wrapitems-center p-1 bg-gray-900 rounded border border-gray-800`} style={{ width: '862px', height: '46px' }}>
      {chips.map((chip, index) => (
        <Chip key={chip} chip={chip} tabIndex={0} onDelete={handleDelete} onKeyDown={handleChipKeyDown(index)} ref={index === 0 ? firstChipRef : undefined} />
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
