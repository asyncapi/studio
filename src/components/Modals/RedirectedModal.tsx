import { useState } from 'react';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './ConfirmModal';
import { Markdown } from '../common';

const CHANGES = `
Below are the changes compared to the old AsyncAPI Playground:
  
- There is no preview for markdown.
- Studio supports the same query parameters except **template**.
- To download an AsyncAPI document from an external source use the editor menu and select **Import from URL**. There is also an option to use a local file, base64 saved file, convert a given version of AsyncAPI document to a newer one as well as change the format from YAML to JSON and vice versa. There is also option to download AsyncAPI document as file.
- To generate the template, please click on the **Generate code/docs** item in the menu at the top right corner of the editor, enter (needed) the parameters and click **Generate**.
- The left navigation is used to open/close the panels.
- Errors in the AsyncAPI document are shown in a panel at the bottom of the editor. The panel is expandable.
- To see the data flow in AsyncAPI document click the 4th node in the left navigation.
- To select a sample template file click on the 5th item in the left navigation. 
- Studio settings can be changed by clicking on the settings icon in the lower left corner.
- Panels can be stretched.
`;

function onCancel() {
  if (typeof window.history.replaceState === 'function') {
    const url = new URL(window.location.href);
    url.searchParams.delete('redirectedFrom');
    window.history.replaceState({}, window.location.href, url.toString());
  }
}

export const RedirectedModal = create(() => {
  const [showMore, setShowMore] = useState(false);

  return (
    <ConfirmModal
      title='Welcome to the AsyncAPI Studio!'
      cancelText='OK'
      onCancel={onCancel}
    >
      <div className="flex flex-col content-center justify-center">
        <div className={`${showMore ? '' : 'h-36'} overflow-y-hidden relative`}>
          <Markdown>
            {CHANGES}
          </Markdown>
          {!showMore && (
            <>
              <div className='absolute top-12 bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white' />
              <div className='absolute bottom-0 left-0 right-0 text-center z-50'>
                <button
                  type="button"
                  className='mx-auto rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm'
                  onClick={() => setShowMore(true)}
                >
                  Show what&apos;s changed
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ConfirmModal>
  );
});
