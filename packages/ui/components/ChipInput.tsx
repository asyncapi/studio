import { FunctionComponent, KeyboardEvent } from 'react';

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
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      onChange([...chips, event.currentTarget.value.trim()]);
      event.currentTarget.value = '';
    }
  };

  const handleDelete = (chipToDelete: string) => () => {
    const updatedChips = chips.filter(chip => chip !== chipToDelete);
    onChange(updatedChips);
  };

  return (
    <div className={`${className} flex flex-wrap items-center p-1 bg-gray-900 rounded border-2 border-gray-700`}>
      {chips.map(chip => (
        <div key={chip} className="m-1 bg-gray-800 text-white rounded px-2 py-1 flex items-center">
          <span>{chip}</span>
          <button onClick={handleDelete(chip)} className="ml-1 text-gray-400 focus:outline-none">×</button>
        </div>
      ))}
      <input
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
