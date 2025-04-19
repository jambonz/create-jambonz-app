const js = require('@eslint/js');
const globals = require('globals');
const promise = require('eslint-plugin-promise');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['test/*'],
    plugins: {
      promise
    },
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        DTRACE_HTTP_CLIENT_REQUEST: false,
        LTTNG_HTTP_CLIENT_REQUEST: false,
        COUNTER_HTTP_CLIENT_REQUEST: false,
        DTRACE_HTTP_CLIENT_RESPONSE: false,
        LTTNG_HTTP_CLIENT_RESPONSE: false,
        COUNTER_HTTP_CLIENT_RESPONSE: false,
        DTRACE_HTTP_SERVER_REQUEST: false,
        LTTNG_HTTP_SERVER_REQUEST: false,
        COUNTER_HTTP_SERVER_REQUEST: false,
        DTRACE_HTTP_SERVER_RESPONSE: false,
        LTTNG_HTTP_SERVER_RESPONSE: false,
        COUNTER_HTTP_SERVER_RESPONSE: false,
        DTRACE_NET_STREAM_END: false,
        LTTNG_NET_STREAM_END: false,
        COUNTER_NET_SERVER_CONNECTION_CLOSE: false,
        DTRACE_NET_SERVER_CONNECTION: false,
        LTTNG_NET_SERVER_CONNECTION: false,
        COUNTER_NET_SERVER_CONNECTION: false
      }
    },
    rules: {
      // Promise rules
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/no-return-in-finally': 'warn',

      // Possible Errors
      'comma-dangle': ['error', 'only-multiline'],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-negated-in-lhs': 'error',
      'no-obj-calls': 'error',
      'no-proto': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Best Practices
      'no-fallthrough': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-self-assign': 'error',
      'no-unused-labels': 'error',

      // Variables
      'no-delete-var': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'none' }],

      // Node.js and CommonJS
      'no-mixed-requires': 'error',
      'no-new-require': 'error',
      'no-path-concat': 'error',

      // Stylistic Issues
      'comma-spacing': 'error',
      'eol-last': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': 'error',
      'max-len': ['error', 120, 2],
      'new-parens': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-trailing-spaces': ['error', { skipBlankLines: false }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': 'error',
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',

      // ECMAScript 6
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'constructor-super': 'error',
      'no-class-assign': 'error',
      'no-confusing-arrow': 'error',
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-new-symbol': 'error',
      'no-this-before-super': 'error',
      'prefer-const': 'error'
    }
  }
];
