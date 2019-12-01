module.exports = {
    'env': {
      'browser': true,
      'es6': true,
      'node': true,
    },
    'extends': [
      'eslint:recommended',
      'google',
      'plugin:import/errors',
      'plugin:import/warnings'
    ],
    'plugins': [
      'import'
    ],
    'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly',
    },
    'parser': 'babel-eslint',
    'parserOptions': {
      'sourceType': 'module',
    },
    'rules': {
      'indent': ['error', 4],
      'require-jsdoc': 0,
      'max-len': [1, 100, 4]
    },
  };
  