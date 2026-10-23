/* ============ 技术栈环形图（谷歌生态图线框风） ============
 * 用法：页面放 <div id="techRing"></div> + <div id="techList"></div>，
 *       引入本文件（defer，需在 i18n.js 之后）。
 * 依赖：i18n.js 的 data-i18n 机制与 __i18nApply 钩子（含 'i18n:applied' 事件）。
 * 词典 key：tech.1~6（名称）、tech.d.1~6（说明）、tech.core（中心）。
 * 交互：双轨反向缓转；悬停节点暂停并联动底部说明；prefers-reduced-motion 静态。
 */
(function () {
  'use strict';

  /* ---- 图标（内联 SVG，currentColor，与站内 Material 图标做法一致） ---- */
  const svg = (d, s) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    grid:  '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    queue: '<path d="M4 6h11"/><circle cx="19" cy="6" r="1.6"/><path d="M4 12h7"/><circle cx="15" cy="12" r="1.6"/><path d="M4 18h11"/><circle cx="19" cy="18" r="1.6"/>',
    cube:  '<path d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6z"/><path d="M12 12l8-4.4M12 12L4 7.6M12 12v9"/>',
    chart: '<path d="M5 20v-7M12 20V5M19 20v-10"/><path d="M3 20h18"/>',
    cloud: '<path d="M7 18.5h10.5a3.5 3.5 0 0 0 .6-6.95A6 6 0 0 0 6.4 9.7 4.4 4.4 0 0 0 7 18.5z"/>',
    code:  '<path d="M9 6.5L3.5 12 9 17.5M15 6.5l5.5 5.5L15 17.5"/>',
    hub:   '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M18.7 5.3l-2.8 2.8M8.1 15.9l-2.8 2.8"/>'
  };
  const ITEMS = [
    { icon: 'grid',  key: 'tech.1', dkey: 'tech.d.1' },
    { icon: 'queue', key: 'tech.2', dkey: 'tech.d.2' },
    { icon: 'cube',  key: 'tech.3', dkey: 'tech.d.3' },
    { icon: 'chart', key: 'tech.4', dkey: 'tech.d.4' },
    { icon: 'cloud', key: 'tech.5', dkey: 'tech.d.5' },
    { icon: 'code',  key: 'tech.6', dkey: 'tech.d.6' }
  ];

  const STYLE = `
    .tr-stage{position:relative;width:100%;max-width:460px;aspect-ratio:23/20;margin:0 auto;user-select:none}
    .tr-ring{position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none}
    .tr-ring.r2{width:87%;aspect-ratio:400/172;border:1px dashed var(--line-2,#e2e5ea)}
    .tr-ring.r1{width:57.5%;aspect-ratio:400/172;border:1px solid var(--line,#eceef2)}
    .tr-core{
      position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
      width:104px;height:104px;border-radius:50%;
      background:#fff;border:1px solid var(--line,#eceef2);
      box-shadow:0 4px 16px -6px rgba(17,24,39,.10),0 0 0 6px var(--wash,#fafbfc);
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
      text-decoration:none;color:var(--ink,#111827);z-index:50;
    }
    .tr-core .tr-ci{color:#6d5ef0}
    .tr-core .tr-cl{font-size:12px;font-weight:600;line-height:1.25;text-align:center;max-width:104px}
    .tr-node{
      position:absolute;left:0;top:0;z-index:10;
      display:flex;flex-direction:column;align-items:center;gap:5px;
      text-decoration:none;will-change:transform,opacity;
    }
    .tr-dot{
      width:48px;height:48px;border-radius:50%;
      background:#fff;border:1px solid var(--line,#eceef2);
      box-shadow:0 2px 10px -2px rgba(17,24,39,.08);
      display:grid;place-items:center;color:#6d5ef0;
      transition:border-color .2s,box-shadow .2s;
    }
    .tr-lb{font-size:12px;color:var(--sub,#6b7280);text-align:center;max-width:80px;line-height:1.3;transition:color .2s}
    .tr-node:hover .tr-dot,.tr-node:focus-visible .tr-dot{border-color:#6d5ef0;box-shadow:0 4px 14px -2px rgba(109,94,240,.30);outline:none}
    .tr-node:hover .tr-lb{color:var(--ink,#111827)}
    .tr-mini{position:absolute;width:6px;height:6px;border-radius:50%;background:#c4b5fd;left:0;top:0;z-index:5;will-change:transform}
    .tr-cap{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-size:12.5px;color:var(--faint,#9ca3af);text-align:center;max-width:92%;pointer-events:none}
    .tr-cap b{color:var(--ink,#111827);font-weight:600}
    /* 右侧清单（M3 卡片行） */
    .tr-item{display:flex;align-items:flex-start;gap:14px;padding:13px 16px;background:#fff;border:1px solid var(--line,#eceef2);border-radius:16px;transition:border-color .2s}
    .tr-item:hover{border-color:#ddd6fe}
    .tr-item .tr-ic{flex:0 0 36px;height:36px;border-radius:10px;background:#f1edfd;color:#4c3fd6;display:grid;place-items:center}
    .tr-item b{display:block;font-size:14px;font-weight:600;color:var(--ink,#111827)}
    .tr-item .tr-desc{display:block;margin-top:2px;font-size:13px;color:var(--sub,#6b7280)}
    @media (prefers-reduced-motion: reduce){ .tr-stage *{animation:none!important;transition:none!important} }
  `;

  function build() {
    const mount = document.getElementById('techRing');
    const list = document.getElementById('techList');
    if (!mount) return;

    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    stage = document.createElement('div');
    stage.className = 'tr-stage';
    stage.innerHTML = [
      '<div class="tr-ring r2"></div>',
      '<div class="tr-ring r1"></div>',
      '<a class="tr-core" href="#">',
      `  <span class="tr-ci">${svg(ICONS.hub, 26)}</span>`,
      '  <span class="tr-cl" data-i18n="tech.core">ShopeX 技术中台</span>',
      '</a>',
      '<div class="tr-cap" id="trCap"></div>'
    ].join('');
    mount.appendChild(stage);

    cap = stage.querySelector('#trCap');
    core = stage.querySelector('.tr-core');
    setCap('tech.core', null);
    core.addEventListener('pointerenter', () => { paused++; setCap('tech.core', null); });
    core.addEventListener('pointerleave', () => { paused = Math.max(0, paused - 1); setCap(curKey, curDKey); });

    nodes = ITEMS.map((it) => {
      const n = document.createElement('a');
      n.className = 'tr-node'; n.href = '#';
      n.innerHTML = `<span class="tr-dot">${svg(ICONS[it.icon], 22)}</span><span class="tr-lb" data-i18n="${it.key}"></span>`;
      n.addEventListener('pointerenter', () => { paused++; n.style.zIndex = 60; setCap(it.key, it.dkey); });
      n.addEventListener('pointerleave', () => { paused = Math.max(0, paused - 1); n.style.zIndex = ''; setCap(curKey, curDKey); });
      stage.appendChild(n);
      return n;
    });
    minis = [0, 1, 2].map(() => {
      const m = document.createElement('i');
      m.className = 'tr-mini'; stage.appendChild(m);
      return m;
    });

    if (list) {
      list.innerHTML = ITEMS.map((it) => `
        <div class="tr-item">
          <span class="tr-ic">${svg(ICONS[it.icon], 20)}</span>
          <span>
            <b data-i18n="${it.key}"></b>
            <span class="tr-desc" data-i18n="${it.dkey}"></span>
          </span>
        </div>`).join('');
    }

    // 渲染晚于 i18n 首次 apply：补一次翻译；语言切换时 apply() 全文档重扫即可覆盖
    if (window.__i18nApply) window.__i18nApply(document.documentElement.lang || undefined);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint();
    } else {
      requestAnimationFrame(tick);
    }
  }

  /* ---- 动画 ---- */
  let stage, cap, core, nodes = [], minis = [];
  let paused = 0, angle = -Math.PI / 2, last = 0;
  let curKey = 'tech.core', curDKey = null;

  function setCap(key, dkey) {
    curKey = key; curDKey = dkey;
    if (!cap) return;
    cap.innerHTML = dkey
      ? `<b data-i18n="${key}"></b><span> — </span><span data-i18n="${dkey}"></span>`
      : `<b data-i18n="${key}"></b>`;
    if (window.__i18nApply) window.__i18nApply(document.documentElement.lang || undefined);
    else {
      // 兜底：无 i18n 钩子时直接置空（由浏览器显示默认文案的场景很少）
      cap.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = ''; });
    }
  }

  function paint() {
    if (!stage || !stage.isConnected) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w) return;
    const cx = w / 2, cy = h * 0.53;
    const R2 = w * (w >= 460 ? 0.435 : 0.38), ry2 = R2 * 0.43;
    const R1 = w * (w >= 460 ? 0.287 : 0.25), ry1 = R1 * 0.43;
    nodes.forEach((n, i) => {
      const a = angle + (i * Math.PI * 2) / nodes.length;
      const x = cx + Math.cos(a) * R2, y = cy + Math.sin(a) * ry2;
      const depth = (Math.sin(a) + 1) / 2;
      n.style.transform = `translate(${x}px,${y}px) translate(-50%,-58%) scale(${(0.9 + 0.12 * depth).toFixed(3)})`;
      n.style.opacity = (0.7 + 0.3 * depth).toFixed(2);
      n.style.zIndex = String(10 + Math.round(depth * 30));
    });
    minis.forEach((m, i) => {
      const a = -angle * 0.7 + (i * Math.PI * 2) / minis.length + 0.6;
      m.style.transform = `translate(${cx + Math.cos(a) * R1 - 3}px,${cy + Math.sin(a) * ry1 - 3}px)`;
      m.style.opacity = '0.8';
    });
  }

  function tick(t) {
    if (!stage || !stage.isConnected) return;
    if (!last) last = t;
    const dt = (t - last) / 1000; last = t;
    if (!paused) angle += 0.09 * dt;
    paint();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
