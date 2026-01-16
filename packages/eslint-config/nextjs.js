module.exports = {
  extends: ['next/core-web-vitals', './base.js'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};
