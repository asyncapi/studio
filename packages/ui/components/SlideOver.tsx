import { XMarkIcon } from 'ui/icons';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="w-full h-full max-w-lg bg-gray-950/[.67] text-gray-200 shadow-lg overflow-auto relative p-2.5 border-l-2 border-gray-700 backdrop-blur-[20px]" tabIndex={0} onKeyDown={handleKeyDown}>
        <button className="absolute top-2 right-2 focus:outline-white" onClick={onClose} aria-label="Close">
            <XMarkIcon/>
        </button>
        {children}
    </div>
  );
};

export default SlideOver;
