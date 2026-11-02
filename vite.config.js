import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

/* 多页面入口：主站 + 技术架构子页面
 * 新增技术子页面时，把文件路径加进 build.rolldownOptions.input 与
 * src/layout/chrome.js 的 TECH_PAGES（导航/页脚/子导航会自动同步）。
 */
const pages = {
  main: resolve(__dirname, 'index.html'),
  'tech-architecture': resolve(__dirname, 'tech/index.html'),
  'tech-reliability': resolve(__dirname, 'tech/reliability.html'),
  'tech-security': resolve(__dirname, 'tech/security.html'),
  'tech-deployment': resolve(__dirname, 'tech/deployment.html'),
};

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 4174,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4175,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    rolldownOptions: {
      input: {
        ...pages,
        'hotel-procurement': resolve(__dirname, 'hotel-procurement.html'),
        'medical-device': resolve(__dirname, 'medical-device.html'),
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'material',
              test: /node_modules[\\/]@material[\\/]/,
              priority: 20,
            },
            {
              name: 'i18n',
              test: /src[\\/]i18n[\\/]/,
              priority: 10,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
            },
          ],
        },
      },
    },
  },
});
