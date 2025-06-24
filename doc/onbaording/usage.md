---
title: 'Usage'
weight: 40
---

## Getting Started with the Interface

When you first open AsyncAPI Studio, you'll see the main editor interface with the following components:

1. **Editor Panel**: The central area where you write and edit your AsyncAPI document  
   ![Screenshot: Editor Panel](images/editor-panel.png)
2. **Navigation Sidebar**: Access different views and tools  
   ![Screenshot: Navigation Sidebar](images/getting-started-navigation-panel.png)
3. **Preview Panel**: View documentation, visual diagrams, or generated code  
   ![Screenshot: Preview Panel](images/preview-panel.png)
4. **Toolbar**: Access common actions like validation, saving, and sharing 

## Creating a New AsyncAPI Document

To create a new AsyncAPI document:

1. Click on the **New Document** button in the toolbar  
   ![Screenshot: New Document button](images/creating-new-document-1.png)
2. Select the AsyncAPI version you want to use (2.0.0, 2.1.0, 2.2.0, etc.)  
   ![Screenshot: Version selection](images/creating-new-document-2.png)
3. Choose a template to start with (Minimal, Kafka, MQTT, etc.) or start from scratch  
   ![Screenshot: Template selection](images/creating-new-document-3.png)
4. Begin editing your document in the editor panel  
   ![Screenshot: Editor panel with new document](images/creating-new-document-4.png)

## Editing AsyncAPI Documents

The Studio editor provides several features to help you create and edit AsyncAPI documents:

### Syntax Highlighting

The editor automatically highlights different parts of your AsyncAPI document to make it easier to read and understand:

- Keywords and property names
- Values and types
- References and components
- Comments and annotations

![Screenshot: Syntax Highlighting](images/editing-syntax-highlighting.png)

### Code Completion

As you type, the editor suggests completions based on the AsyncAPI specification:

1. Press **Ctrl+Space** (or **Cmd+Space** on Mac) to manually trigger suggestions  
   ![Screenshot: Code Completion](images/editing-code-completion.png)
2. The editor will suggest property names, values, and schema components based on the context

### Error Detection

The editor validates your document in real-time and highlights errors:

- Syntax errors are marked with red squiggly underlines
- Hover over an error to see a description of the problem
- The status bar at the bottom shows the total number of errors and warnings

![Screenshot: Error Detection](images/editing-error-detection.png)

## Validating Your AsyncAPI Document

To validate your AsyncAPI document and see detailed validation results:

1. Click the **Validate** button in the toolbar  
   ![Screenshot: Validate button](images/validating-1.png)
2. The validation panel will appear showing any errors or warnings  
   ![Screenshot: Validation panel](images/validating-2.png)
3. Click on an error to jump to its location in the document  
   ![Screenshot: Error location](images/validating-3.png)
4. Fix the issues and re-validate until all errors are resolved  
   ![Screenshot: All errors resolved](images/validating-4.png)

## Converting Between AsyncAPI Versions

To convert your AsyncAPI document to a different version:

1. Click on the **Convert** button in the toolbar  
   ![Screenshot: Convert button](images/converting-1.png)
2. Select the target version you want to convert to  
   ![Screenshot: Target version selection](images/converting-2.png)
3. Review the converted document in the preview panel  
   ![Screenshot: Converted document preview](images/converting-3.png)
4. Click **Apply** to replace your document with the converted version, or **Cancel** to discard  
   ![Screenshot: Apply or Cancel conversion](images/converting-4.png)

## Previewing Documentation

To see how your AsyncAPI document will be rendered as documentation:

1. Click on the **Preview** tab in the preview panel  
   ![Screenshot: Preview tab](images/previewing-1.png)
2. The documentation will be rendered using the AsyncAPI React component  
   ![Screenshot: Documentation rendered](images/previewing-2.png)
3. Scroll through the preview to see all sections of your document  
   ![Screenshot: Scrolling preview](images/previewing-3.png)
4. The preview updates automatically as you edit your document  
   ![Screenshot: Live preview update](images/previewing-4.png)

## Visualizing Your API

To visualize the structure and message flows of your API:

1. Click on the **Visualize** tab in the preview panel  
   ![Screenshot: Visualize tab](images/visualizing-1.png)
2. The visualization will show:
   - Services and operations
   - Message flows between components
   - Message schemas and formats
   ![Screenshot: Visualization diagram](images/visualizing-2.png)
3. You can:
   - Zoom in/out using the mouse wheel  
     ![Screenshot: Zoom controls](images/visualizing-3.png)
   - Drag components to rearrange the diagram  
     ![Screenshot: Dragging components](images/visualizing-4.png)
   - Click on components to see their details  
     ![Screenshot: Component details](images/visualizing-5.png)

## Generating Code

To generate code from your AsyncAPI document:

1. Click on the **Generate** tab in the preview panel  
   ![Screenshot: Generate tab](images/generating-code-1.png)
2. Select a template from the dropdown menu  
   ![Screenshot: Template dropdown](images/generating-code-2.png)
3. Configure any template-specific options  
   ![Screenshot: Template options](images/generating-code-3.png)
4. Click **Generate** to create the code  
   ![Screenshot: Generate button](images/generating-code-4.png)
5. Download the generated code as a ZIP file  
   ![Screenshot: Download ZIP](images/generating-code-5.png)

## Sharing Your AsyncAPI Document

You can share your AsyncAPI document in several ways:

### URL Sharing

1. Click on the **Share** button in the toolbar  
   ![Screenshot: Share button](images/sharing-1.png)
2. Copy the provided URL  
   ![Screenshot: Share URL](images/sharing-2.png)
3. Share the URL with others who can view and edit your document  
   ![Screenshot: Sharing with others](images/sharing-3.png)

### File Export

1. Click on the **Download** button in the toolbar  
   ![Screenshot: Download button](images/sharing-4.png)
2. Select the format you want to export to (YAML or JSON)  
   ![Screenshot: Format selection](images/sharing-5.png)
3. Save the file to your computer or share it directly  
   ![Screenshot: Save file dialog](images/sharing-6.png)

## Keyboard Shortcuts

AsyncAPI Studio provides several keyboard shortcuts to improve productivity:

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Save | Ctrl+S | Cmd+S |
| Find | Ctrl+F | Cmd+F |
| Replace | Ctrl+H | Cmd+H |
| Format Document | Shift+Alt+F | Shift+Option+F |
| Validate | Ctrl+Shift+V | Cmd+Shift+V |
| Toggle Comment | Ctrl+/ | Cmd+/ |
| Indent | Tab | Tab |
| Outdent | Shift+Tab | Shift+Tab |

![Screenshot: Keyboard Shortcuts](images/shortcuts.png)

## Best Practices

Here are some tips for effectively using AsyncAPI Studio:

1. **Start with a template**: Use the provided templates as a starting point to save time
2. **Validate regularly**: Validate your document frequently to catch errors early
3. **Use components**: Define reusable schemas in the components section for better organization
4. **Add descriptions**: Include detailed descriptions for operations, messages, and schemas
5. **Use examples**: Provide examples for messages to help users understand the API better
6. **Organize your document**: Use meaningful operation IDs and message names for clarity

![Screenshot: Best Practices](images/best-practices.png)

## Troubleshooting

If you encounter issues while using AsyncAPI Studio:

1. **Editor not loading**: Try clearing your browser cache and reloading the page  
   ![Screenshot: Editor not loading](images/troubleshooting-1.png)
2. **Validation errors**: Check the AsyncAPI specification version you're using and ensure your document follows that version  
   ![Screenshot: Validation errors](images/troubleshooting-2.png)
3. **Preview not updating**: Save your document and refresh the preview panel  
   ![Screenshot: Preview not updating](images/troubleshooting-3.png)
4. **Performance issues**: For large documents, consider splitting them into smaller files and using references  
   ![Screenshot: Performance issues](images/troubleshooting-4.png)