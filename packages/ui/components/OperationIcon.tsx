import { FunctionComponent } from 'react';
import { ArrowUturnLeftIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface IconProps {
  operation: 'send' | 'receive' | 'reply';
}

export const OperationIcon: FunctionComponent<IconProps> = ({ operation }) => {
  const bgColors = {
    send: 'bg-blue-100',
    receive: 'bg-green-100',
    reply: 'bg-purple-100',
  };

  const iconColors = {
    send: 'text-blue-500',
    receive: 'text-green-500',
    reply: 'text-purple-500',
  };

  const IconComponent = (() => {
    switch (operation) {
    case 'send':
      return ArrowUpRightIcon;
    case 'receive':
      return ArrowDownLeftIcon;
    case 'reply':
      return ArrowUturnLeftIcon;
    }
  })();

  return (
    <div className={`${bgColors[operation]} w-7 h-7 rounded-md flex items-center justify-center`}>
      <IconComponent className={`${iconColors[operation]} w-5 h-5`} />
    </div>
  );
};
