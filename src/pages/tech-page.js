/* ============ 技术子页面入口 ============
 * 每个 /tech/*.html 只加载这一个入口；页面 id 由 <html data-tech-page="..."> 声明。
 * 顺序很重要：先挂外壳（chrome），再加载 i18n —— 否则注入的 data-i18n 不会被翻译。
 * 样式顺序与主站一致（header-footer 在 section-tones 之前），确保页脚与主站同为深色。
 */

import '../styles/tailwind.css';
import '../styles/base.css';
import '../styles/header-footer.css';
import '../styles/section-tones.css';
import '../styles/tech-pages.css';

import { mountChrome } from '../layout/chrome.js';

const page = document.documentElement.dataset.techPage || 'architecture';

mountChrome(page);

import('../i18n/index.js').then(() => {
  document.dispatchEvent(new CustomEvent('tech:chrome-ready', { detail: { page } }));
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 滚动入场：进入视口时给 .tp-reveal 加 .in（与主站 cert-in 同款曲线） ---- */
(function revealOnScroll() {
  const targets = document.querySelectorAll('.tp-reveal');
  if (!targets.length) return;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => io.observe(el));
})();

/* ---- 数字递增：与主站 cases.js 的 cc-statnum 同款（900ms，只在首次入视执行一次） ---- */
(function countUp() {
  const statsBox = document.querySelector('.tp-stats');
  if (!statsBox) return;
  const nums = [...statsBox.querySelectorAll('.tp-stat b[data-value]')];
  const fmt = (n) => (n >= 1000 ? n.toLocaleString('en-US') : String(n));
  const run = () => {
    nums.forEach((el, index) => {
      const target = parseInt(el.getAttribute('data-value'), 10) || 0;
      if (reduced) { el.textContent = fmt(target); return; }
      el.textContent = '0';
      const t0 = performance.now() + index * 120;
      const dur = 900;
      (function tick(t) {
        const p = Math.min(Math.max((t - t0) / dur, 0), 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  };
  if (reduced || !('IntersectionObserver' in window)) { run(); return; }
  /* 每次进入视口都重播一次（用户反馈：数字动效想在每次翻到时都看到） */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) run();
      });
    },
    { threshold: 0.4 },
  );
  io.observe(statsBox);
})();

/* ---- 微服务与 BFF 手风琴：悬停/点击时当前面板横向撑开，其余收缩 ---- */
(function msAccordion() {
  const box = document.querySelector('.tp-msflow');
  if (!box) return;
  const rows = [...box.querySelectorAll('.tp-msflow-row')];
  if (!rows.length) return;
  const open = (row) => rows.forEach((r) => r.classList.toggle('is-open', r === row));
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => open(row));
    row.addEventListener('click', () => open(row)); /* 触屏设备没有 hover，用点按展开 */
    row.addEventListener('focusin', () => open(row));
  });
})();

/* 章节内锚点平滑滚动（保留 prefers-reduced-motion 尊重） */
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
});
