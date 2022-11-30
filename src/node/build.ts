import { CLIENT_ENTRY_PATH, SSR_ENTRY_PATH } from './constants';
import { InlineConfig, build as viteBuild } from 'vite';

import type { RollupOutput } from 'rollup';
import fsx from 'fs-extra';
import path from 'path';
import pluginReact from '@vitejs/plugin-react';
import { render } from '../runtime/ssr-entry';

export async function bundle(root: string) {
  try {
    /**
     *
     * @param isServer 是否服务端渲染
     */
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: [pluginReact()],
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SSR_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    console.log('Building client + server bundles...');
    return (await Promise.all([
      clientBuild(),
      serverBuild()
    ])) as RollupOutput[];
  } catch (e) {
    console.log(e);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/${clientChunk.fileName}" type="module"></script>
  </body>
</html>
    `.trim();

  await fsx.writeFile(path.join(root, 'build', 'index.html'), html);
  await fsx.remove(path.join(root, '.temp'));
}

export async function build(root: string = process.cwd()) {
  /**
   *
   * 1. 打包代码，包括 client 端 + server 端
   *
   * 2. 引入 server-entry 模块
   *
   * 3. 服务端渲染，产出
   */

  // 1. 打包代码，包括 client 端 + server 端
  const [clientBundle, serverBundle] = await bundle(root);

  // 2. 引入 server-entry 模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');

  // 3. 服务端渲染，产出
  //   const { render } = require(serverEntryPath);
  await renderPage(render, root, clientBundle);
}
