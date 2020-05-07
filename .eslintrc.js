module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest/globals": true,
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "React": "writable"
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "jest",
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "no-useless-catch": "off",
  },
};
