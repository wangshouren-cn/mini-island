import { createServer as createViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [
      /**
       * 接入 react 插件实现热更新效果
       */
      pluginReact(),
      pluginIndexHtml()
    ]
  });
}
