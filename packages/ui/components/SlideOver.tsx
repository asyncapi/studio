<<<<<<< HEAD
=======
// SlideOver.tsx
>>>>>>> 69b7ababfa7d1a6e5dc28e29eaa5d74276df448f
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18L18 6M6 6L18 18" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-end z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="w-full max-w-lg bg-gray-950 text-gray-200 rounded-md shadow-lg overflow-auto relative p-2.5">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default SlideOver;
