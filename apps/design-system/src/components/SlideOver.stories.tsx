import { useState } from "react";
import { SlideOver } from "ui";

export default {
  component: SlideOver,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  },
};

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button onClick={handleOpen}>Open SlideOver</button>

      <SlideOver isOpen={isOpen} onClose={handleClose}>
        <h2>Content of the SlideOver</h2>
      </SlideOver>
    </div>
  );
};
