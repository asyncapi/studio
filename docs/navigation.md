# Navigation panel

This document will walk you through the functions of each button in the navigation panel. 

# Navigation Button

The first button in the navigation panel is the Navigation button. It is one of the default active buttons.

The navigation button is divided into four parts. It provides the following information:

- Servers
- Operations
- Messages
- Schemas

## Servers

The Servers section displays the name and information of the [server]( https://www.asyncapi.com/docs/concepts/server) you are using to build your AsyncAPI.

## Operations

The Operations section lists all the operations that are a part of the AsyncAPI. It adds the perfix `PUB`  for publisher and `SUB` for subscriber to differentiate between both the operations.

## Messages

The Messages section displays the messages stored in the `components.messages` section. This does not mean that every message in the component is used.  It can be defined but it may not used by references in the `operation` field.


## Schemas

The Schemas displays the schemas stored in the `components.schemas` section. This does not mean that every schema is used in the document. You can have it defined but it may not be used by references in the `message.payload` field.


# Editor

The Editor section is where you edit the AsyncAPI file. As you edit, you will see the changes reflect dynamically in the HTML preview and Block Visualizer section.

Click on the individual elements of the Navigation button to jump to those sections in HTML preview and Block Visualizer section.

## Diagnostics Window

The Editor also has a resizeable Diagnostics window. It shows a quick count number of... 
- errors (in red),
- warnings (in yellow),
- information (in blue),
- hints (in green)
...by its title. The description of the diagnostics with line number is displayed in a table.

To the right side of the title bar there are three indicators of the Diagnostics window: 

- Valid/Invalid - It is green if the syntax is green and red when invalid.
- Autosave - It shows whether Autosave is on or off.
- Type - Shows the language in which the API is written: `JSON` or `YAML`.

Below the title bar there is a control panel. You can use the buttons to:

- Hide and show erros
- Hide and show warnings
- Hide and show information messages
- Hide and show hints

There is also a search bar that aids in finding issues by their names. You will see the Settings icon to the right. It will take you to the governance of Diagnostic's settings window.

# HTML Preview

This section displays the preview of everything you have written in the code editor. It uses different fonts, colors, and styles for readability. Each section has a different card. 

It starts with displaying the title, version, and description of the API. It renders the formatting too. You can expand each element too via the `key: value` pair of each element, type, payload, and message.


# Blocks visualizer

Blocks visualizer gives you a quick overview of your API. Unlike HTML preview, Blocks visualizer gives a diagrammatic visual of your API. 

The title card is at the top-left corner of the Block visualizer window. Followed by the Operations card.  You can visualize channels, published messages, payload, type,  patterns, and relationships between the components.

The Blocks visualizer has two set of controls:

- In the top right corner of the window you will find the play and reset button. Play to view live relationship between the components and its flow. Reset to get back to the default view.

- To the bottom left of the window there are four controls: zoom in, zoom out, full-screen, and toogle interactivity. You zoom the cards in and out or view them in full-screen mode. To prevent the cards from shifting use the toggle interactivity control.


# New File

To create a new file you can pick one of the available templates.

## Templates

There are 5 available to quick start Studio. 

- Simple Example - A basic example of a service that is in charge of processing user signups. Great place to start learning AsyncAPI.

- Apache Kafka - A framework implementation of a software bus using stream-processing. Open Source developed by the Apache Software Foundation.

- WebSocket - A framework implementation of a software bus using stream-processing. Open Source developed by the Apache Software Foundation.

- MQTT - A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.

- HTTP - A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.

## Real World Examples

Studio provides two templates to help you get started.

- Slack Real Time Messaging API - Slack Real time messaging API. Using HTTP protocol.

- Gitter Streaming API - Gitter Streaming API from https://stream.gitter.im. Using HTTP protocol.

## Tutorials

Studio also provides you with a template of an invalid AsyncAPI document. The purpose of this tutorial is to educate, and learn document validation.

[You can request to add a Studio template](https://github.com/asyncapi/studio/issues/new?assignees=&labels=enhancement&template=enhancement.md&title=Template%20Request:%20{%20template%20name%20and%20type%20}) to the list if you don't find what you are looking for.
