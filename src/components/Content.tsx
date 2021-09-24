import React from 'react';
import SplitPane from 'react-split-pane';

import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Template } from './Template';

import { debounce } from '../helpers';
import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();

  const navigationEnabled = sidebarState.panels.navigation.get();
  const editorEnabled = sidebarState.panels.editor.get();
  const templateEnabled = sidebarState.panels.template.get();

  const navigationAndEditor = (
    <SplitPane
      minSize={220}
      maxSize={360}
      pane1Style={!navigationEnabled ? { width: '0px' } : { overflow: 'auto' }}
      pane2Style={!editorEnabled ? { width: '0px' } : undefined}
      primary={!editorEnabled ? 'second' : 'first'}
      defaultSize={
        parseInt(localStorage.getItem('splitPos:left') || '0', 10) || 220
      }
      onChange={debounce((size: string) => {
        localStorage.setItem('splitPos:left', String(size));
      }, 100)}
    >
      <Navigation />
      <Editor />
    </SplitPane>
  );

  return (
    <div className="flex flex-1 flex-row relative">
      <div className="flex flex-1 flex-row relative">
        <SplitPane
          minSize={0}
          pane1Style={
            !navigationEnabled && !editorEnabled ? { width: '0px' } : undefined
          }
          pane2Style={
            !templateEnabled ? { width: '0px' } : { overflow: 'auto' }
          }
          primary={!templateEnabled ? 'second' : 'first'}
          defaultSize={
            parseInt(localStorage.getItem('splitPos:center') || '0', 10) ||
            '55%'
          }
          onChange={debounce((size: string) => {
            localStorage.setItem('splitPos:center', String(size));
          }, 100)}
        >
          {navigationAndEditor}
          <Template />
        </SplitPane>
      </div>
    </div>
  );
};

/////////////////////////
//// react-reflex implementation
/////////////////////////
// let navigationProps = {
//   size: 240,
//   onResize(props: any) {
//     const offsetWidth = (props.domElement as any)?.offsetWidth;
//     if (offsetWidth < 75) {
//       sidebarState.panels.navigation.set(false);
//     }
//   },
// };
// if (sidebarState.show.get() === false) {
//   (navigationProps as any).maxSize = 240;
//   (navigationProps as any).minSize = 240;
//   delete (navigationProps as any).onResize;
// }

// return (
//   <ReflexContainer orientation="vertical">
//     {navigationEnabled && (
//       <ReflexElement {...navigationProps}>
//         <Navigation />
//       </ReflexElement>
//     )}

//     {navigationEnabled && <ReflexSplitter />}

//     {editorEnabled && (
//       <ReflexElement>
//         <Editor />
//       </ReflexElement>
//     )}

//     {editorEnabled && <ReflexSplitter />}

//     {templateEnabled && (
//       <ReflexElement>
//         <Template />
//       </ReflexElement>
//     )}
//   </ReflexContainer>
// );
