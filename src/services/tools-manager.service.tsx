import { VscCode, VscOpenPreview, VscTypeHierarchy, VscTerminal } from 'react-icons/vsc';

import { MonacoWrapper } from '../components/Editor/MonacoWrapper';
import { HTMLWrapper } from '../components/Template';
import { Visualiser } from '../components/Visualiser';
import { Terminal } from '../components/Terminal';

export type ToolID = string;
export interface Tool {
  id: ToolID,
  title: string;
  description: string;
  icon: () => React.ReactNode,
  tab: () => React.ReactNode,
  content: () => React.ReactNode,
}

export class ToolsManager {
  private static tools: Record<string, Tool> = {
    editor: {
      id: 'editor',
      title: 'Editor',
      description: 'Allows you to edit the AsyncAPI document. This is the same editor as in Visual Studio Code',
      icon: () => <VscCode className="h-7 w-7" />,
      tab: () => (
        <span>Editor</span>
      ),
      content: () => <MonacoWrapper />,
    },
    html: {
      id: 'html',
      title: 'HTML Preview',
      description: 'Allows you to preview your AsyncAPI document in HTML',
      icon: () => <VscOpenPreview className="h-7 w-7" />,
      tab: () => (
        <span>HTML</span>
      ),
      content: () => <HTMLWrapper />
    },
    visualiser: {
      id: 'visualiser',
      title: 'Visualiser',
      description: 'Allows you to preview the data flow (by blocks) in your AsyncAPI document',
      icon: () => <VscTypeHierarchy className="h-7 w-7" />,
      tab: () => (
        <span>Visualiser</span>
      ),
      content: () => <Visualiser />
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      description: 'Everything you need to make your AsyncAPI document correct',
      icon: () => <VscTerminal className="h-7 w-7" />,
      tab: () => (
        <span>Terminal</span>
      ),
      content: () => <Terminal />
    },
  }

  public static getTools(): Record<string, Tool> {
    return this.tools;
  }

  public static getTool(id: ToolID): Tool | undefined {
    return this.tools[id];
  }
}
