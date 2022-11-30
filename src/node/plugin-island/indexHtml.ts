import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants';

import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 1. 读取template.html 的内容
          let html = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');

          /**
           * 实现代码变化时重新加载
           * @see https://github.com/vitejs/vite/issues/1984
           */
          html = await server.transformIndexHtml(req.url, html);

          // 2. 响应 html 浏览器
          res.end(html);
        });
      };
    }
  };
}
