import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  sourcemap: true,
  splitting: false,
  external: [],
  target: 'es2020',
  banner: {
    js: '// @asafarim/markdown-utils - Utility functions for markdown processing',
  },
});
