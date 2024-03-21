import { useState } from "react";
import { SlideOver } from "@asyncapi/studio-ui";

const meta = {
  component: SlideOver,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  },
};
export default meta
export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button onClick={handleOpen} className="bg-white text-black rounded my-3 mx-3 px-3">Open SlideOver</button>

      <SlideOver isOpen={isOpen} onClose={handleClose}>
        <h2>Content of the SlideOver</h2>
      </SlideOver>
    </div>
  );
};
