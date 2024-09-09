import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest();
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.yml$': 'jest-transform-yaml',
    '^.+\\.yaml$': 'jest-transform-yaml',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

const asyncConfig = createJestConfig(config);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = ['node_modules/.pnpm/(?!@asyncapi/react-component|monaco-editor)/'];
  return config;
}
