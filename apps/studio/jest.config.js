const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^jsonpath-plus$': '<rootDir>/__mocks__/jsonpath-plus.js',
    '^@asyncapi/react-component$': '<rootDir>/__mocks__/asyncapi-react-component.js',
    '^@asyncapi/react-component/(.*)$': '<rootDir>/__mocks__/asyncapi-react-component.js',
    '^monaco-editor$': '<rootDir>/__mocks__/monaco-editor.js',
    '^monaco-editor/(.*)$': '<rootDir>/__mocks__/monaco-editor.js',
    '^monaco-yaml$': '<rootDir>/__mocks__/monaco-yaml.js',
    '^monaco-yaml/(.*)$': '<rootDir>/__mocks__/monaco-yaml.js',
    '\\.(ya?ml)$': '<rootDir>/__mocks__/yaml-mock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/style-mock.js',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/file-mock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@asyncapi|@stoplight|js-yaml|@ebay/nice-modal-react|@hookstate)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

module.exports = createJestConfig(customJestConfig);
