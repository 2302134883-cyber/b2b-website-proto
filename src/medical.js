/* 医疗器械 · 合规交易子页面入口：仅加载所需样式与组件 */
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import './styles/tailwind.css';
import './styles/base.css';
import './styles/header-footer.css';
import './styles/what-industries.css';
import './styles/faq.css';
import './styles/section-tones.css';
import './styles/hotel-procurement.css';
import './styles/medical-device.css';

import './components/material.js';
import './components/header.js';
import './components/lead-dialog.js';
import './components/medical-device.js';
import('./components/medical-scene.jsx');

// 子页面深链接：资源加载后定位到指定章节。
window.addEventListener('load', () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  window.setTimeout(() => target?.scrollIntoView({ block: 'start' }), 400);
});
import './i18n/index.js';
