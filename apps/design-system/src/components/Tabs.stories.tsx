import React from 'react';
import { Meta } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@asyncapi/studio-ui'

const meta: Meta = {
  component: Tabs,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  }
}

export default meta


export const Default = {
  render: () => (  <Tabs defaultValue="visual_editor">
    <TabsList>
      <TabsTrigger value="visual_editor">Visual Editor</TabsTrigger>
      <TabsTrigger value="code_editor">Code Editor</TabsTrigger>
      <TabsTrigger value="examples">Examples</TabsTrigger>
    </TabsList>
      <TabsContent value="visual_editor">Visual Editor Layout</TabsContent>
      <TabsContent value="code_editor">Code Editor Layout</TabsContent>
      <TabsContent value="examples">Examples Layout</TabsContent>
  </Tabs>)
}
