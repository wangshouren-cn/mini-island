import { execaCommandSync } from 'execa';
import fse from 'fs-extra';
import path from 'path';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');
const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  // ensure after build
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    // exec build command
    execaCommandSync('pnpm build', {
      ...defaultExecaOpts,
      cwd: path.resolve(__dirname, '../')
    });
  }

  execaCommandSync('npx playwright install', {
    ...defaultExecaOpts,
    cwd: path.join(__dirname, '../')
  });

  execaCommandSync('pnpm i', defaultExecaOpts);

  // exec dev command
  execaCommandSync('pnpm dev', defaultExecaOpts);
}

prepareE2E();
