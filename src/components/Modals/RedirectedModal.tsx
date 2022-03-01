import React, { useEffect, useState } from 'react';

import { ConfirmModal } from './ConfirmModal';
import { Markdown } from '../common';

import state from '../../state';

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

export const RedirectedModal: React.FunctionComponent = () => {
  const [show, setShow] = useState(false);

  const appState = state.useAppState();
  const isRedirected = appState.redirectedFrom.get();

  useEffect(() => {
    isRedirected === 'playground' && setShow(true);
  }, [isRedirected]);

  useEffect(() => {
    show === false && appState.redirectedFrom.set(false);
  }, [show]); // eslint-disable-line

  function onCancel() {
    setShow(false);
  }

  return (
    <ConfirmModal
      title='Welcome in the AsyncAPI Studio!'
      show={show}
      onCancel={onCancel}
    >
      <div className="flex flex-col content-center justify-center">
        <Markdown>
          {CHANGES}
        </Markdown>
      </div>
    </ConfirmModal>
  );
};
