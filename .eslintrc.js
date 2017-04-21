// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never',
    }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-param-reassign': 0,
    'no-bitwise': ['error', { 'allow': ['&', '>>'] }],
    'no-console': ['error', { 'allow': ['log', 'warn', 'error'] }],
    'no-underscore-dangle': 0,
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
