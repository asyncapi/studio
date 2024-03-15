import { Parser } from '@asyncapi/parser';

export async function parseAsyncAPI() {
  const parser = new Parser();
  const { document } = await parser.parse(`
    asyncapi: '2.4.0'
    info:
      title: Example AsyncAPI specification
      version: '0.1.0'
    channels:
      example-channel:
        subscribe:
          message:
            payload:
              type: object
              properties:
                exampleField:
                  type: string
                exampleNumber:
                  type: number
                exampleDate:
                  type: string
                  format: date-time
  `);

  if (document) {
    // Convert the AsyncAPI document JSON to a string
    const documentString = JSON.stringify(document);
    // Encode the string as base64
    const base64Encoded = Buffer.from(documentString).toString('base64');
    // Append the base64 encoded string as a query parameter to your URL
    const urlWithQueryParam = `http://localhost:3000?asyncapi=${encodeURIComponent(base64Encoded)}`;
    
    // // Update the URL in the browser
    // window.history.replaceState({}, '', urlWithQueryParam);

    console.log('URL with base64 encoded AsyncAPI document:', urlWithQueryParam);
    // Output: https://example.com/?asyncapi=eyJhc3luYXBpIjogIjIuNC4wIiwgImluZm8iOiAidGl0bGUiLCAidmVyc2lvbiI6IC
    // And so on... (base64 encoded string)
  }
}

parseAsyncAPI();
