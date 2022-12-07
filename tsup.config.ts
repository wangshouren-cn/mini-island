import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: {
    cli: './src/node/cli.ts',
    index: './src/node/index.ts',
    dev: './src/node/dev.ts'
  },
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  // 让esm模块支持require
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
  }
});
