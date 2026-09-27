// Babel config used by Jest (standalone, without bundler involvement)
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [transformImportMeta],
};

// react-router 8 is ESM-only and its SSR modules reference `import.meta.hot`,
// which is a syntax error once transpiled to CommonJS for Jest. The available
// plugins only rewrite known `import.meta` properties, so replace the whole
// `import.meta` object with a plain object here.
function transformImportMeta() {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
          path.replaceWithSourceString('({})');
        }
      },
    },
  };
}
