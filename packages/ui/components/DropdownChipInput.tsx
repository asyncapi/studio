
import { FunctionComponent, KeyboardEvent, useRef } from 'react';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Chip } from './Chip';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./DropdownMenu"
import { PlusCircleIcon } from './icons';
import { cn } from '@asyncapi/studio-utils';

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface DropdownChipInputProps {
  className?: string;
  chips: string[];
  chipsOptions: string[];
  placeholder?: string;
  onChange: (chips: string[]) => void;
  isDisabled?: boolean;
}

export const DropdownChipInput: FunctionComponent<DropdownChipInputProps> = ({
  className,
  chips,
  chipsOptions,
  onChange,
  placeholder,
  isDisabled = false,
}) => {
  const firstChipRef = useRef<HTMLDivElement>(null);


  const onChipCheckedChange = (chip: string) => {
    if (chips.includes(chip)) {
      handleDelete(chip);
    } else {
      onChange([...chips, chip]);
    }
  }
  const handleChipKeyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
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
    <div className={cn("flex h-11 p-1 bg-gray-900 rounded border border-gray-800 items-center",isDisabled && "opacity-50 pointer-events-none", className)}>
      <div className='flex overflow-scroll no-scrollbar'>
      {chips.length === 0 && placeholder && <span className='text-gray-500'>{placeholder}</span>}
      {chips.map((chip, index) => (
        <Chip key={chip} chip={chip} tabIndex={0} onDelete={handleDelete} onKeyDown={handleChipKeyDown(index)} ref={index === 0 ? firstChipRef : undefined} />
      ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
      <PlusCircleIcon className='min-w-7 w-7 h-7 min-h-7 text-gray-500 ml-auto ' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {chipsOptions.map((chipOption) => (
          <DropdownMenuCheckboxItem key={chipOption} checked={chips.includes(chipOption)} onCheckedChange={() => onChipCheckedChange(chipOption)}>
            {chipOption}
          </DropdownMenuCheckboxItem>
        ))}
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
};
