import { PACKAGE_ROOT } from './constants';
import { createServer as createViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/config';

export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);

  return createViteDevServer({
    root,
    plugins: [
      /**
       * 接入 react 插件实现热更新效果
       */
      pluginReact(),
      pluginIndexHtml(),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        // 允许在 playground 项目中引用到项目文件
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
