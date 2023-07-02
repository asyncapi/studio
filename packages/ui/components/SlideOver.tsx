import React, { useState, useEffect } from "react";

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

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50">
      <div className="w-full h-full max-w-lg bg-gray-950 text-gray-200 rounded-md shadow-lg overflow-auto relative p-2.5" tabIndex={0} onKeyDown={handleKeyDown}>
        <button className="absolute top-2 right-2 focus:outline-white" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default SlideOver;
