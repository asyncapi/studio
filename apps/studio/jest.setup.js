import '@testing-library/jest-dom';
import v8 from 'node:v8';
import { TextEncoder, TextDecoder } from 'node:util';

// jsdom does not provide these globals, but the AsyncAPI parser needs them.
globalThis.TextEncoder ??= TextEncoder;
globalThis.TextDecoder ??= TextDecoder;
globalThis.structuredClone ??= (val) => v8.deserialize(v8.serialize(val));
