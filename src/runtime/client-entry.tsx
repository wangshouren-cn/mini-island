/**
 * 浏览器环境中运行的代码
 */

import { App } from './app';
import { createRoot } from 'react-dom/client';
import siteData from 'island:site-data';

console.log(siteData);

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }

  createRoot(containerEl).render(<App />);
}

renderInBrowser();
