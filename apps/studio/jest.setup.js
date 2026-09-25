import '@testing-library/jest-dom';
import v8 from 'node:v8';
import { TextEncoder, TextDecoder } from 'node:util';

if (globalThis.TextEncoder === undefined) {
  globalThis.TextEncoder = TextEncoder;
}

if (globalThis.TextDecoder === undefined) {
  globalThis.TextDecoder = TextDecoder;
}

if (globalThis.structuredClone === undefined) {
  globalThis.structuredClone = (val) => v8.deserialize(v8.serialize(val));
}
