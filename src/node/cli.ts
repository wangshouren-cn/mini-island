import { build } from './build';
import { cac } from 'cac';
import path from 'path';
import { ViteDevServer } from 'vite';
import pkg from '../../package.json';

const version = pkg.version;

const cli = cac('island').version(version).help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    // root = root ? path.resolve(root) : process.cwd();
    // const server = await createDevServer(root);
    // await server.listen();
    // server.printUrls();

    let server: ViteDevServer;

    const createServer = async () => {
      const { createDevServer } = await import('./dev.js');
      server = await createDevServer(root, restartServer);
      await server.listen();
      server.printUrls();
    };

    const restartServer = async () => {
      await server.close();
      await createServer();
    };

    await createServer();
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = path.resolve(root);
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
