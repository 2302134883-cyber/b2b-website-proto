/* ============ 技术栈环形图（谷歌生态图线框风 · 立体透视版） ============
 * 用法：页面放 <div id="techRing"></div>，引入本文件（defer，需在 i18n.js 之后）。
 * 依赖：i18n.js 的 data-i18n 机制与 __i18nApply 钩子（含 'i18n:applied' 事件）。
 * 词典 key：tech.1~6（名称）、tech.d.1~6（说明）、tech.core（中心名）、tech.core.d（中心说明）。
 * 立体：轨道面透视倾斜，节点按 sin 深度缩放/淡出/虚化，后排穿过中心圆徽后方。
 * 动态：永不停止的双轨反向旋转 + 点击空白加速（惯性衰减）+ 节点浮动呼吸
 *       + 入场 stagger + 核心脉冲环 + 彗星光点沿轨运行。
 * 交互：圆盘节点 / 中心与能力 Tabs 共用 tech:capability-select 事件，
 *       同步更新固定详情面板；数据中台下方嵌入改价场景验证。
 * 悬停或键盘聚焦时暂停视觉运动。i18n 8 语言；prefers-reduced-motion 静态。
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
    hub:   '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M18.7 5.3l-2.8 2.8M8.1 15.9l-2.8 2.8"/>',
    shield:'<path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'
  };
  const ITEMS = [
    { id: 'data',         icon: 'grid',   key: 'tech.1', dkey: 'tech.d.1' },
    { id: 'integration',  icon: 'queue',  key: 'tech.2', dkey: 'tech.d.2' },
    { id: 'microservices',icon: 'cube',   key: 'tech.3', dkey: 'tech.d.3' },
    { id: 'cloud',        icon: 'cloud',  key: 'tech.4', dkey: 'tech.d.4' },
    { id: 'governance',   icon: 'shield', key: 'tech.5', dkey: 'tech.d.5' },
    { id: 'analytics',    icon: 'chart',  key: 'tech.6', dkey: 'tech.d.6' }
  ];
  const BASE_SPEED = 0.09;      // 基础角速度 rad/s
  const CLICK_BOOST = 0.9;      // 每次点击空白追加的角速度
  const BOOST_MAX = 2.8;        // 加速上限

  const STYLE = `
    .tr-stage{position:relative;width:100%;max-width:560px;aspect-ratio:23/19;margin:0 auto;user-select:none;cursor:pointer}
    /* 地面柔光，托住整个装置 */
    .tr-floor{position:absolute;left:50%;top:56%;width:94%;height:60%;transform:translate(-50%,-50%);
      background:radial-gradient(50% 50% at 50% 50%,rgba(109,94,240,.08),transparent 70%);
      filter:blur(12px);pointer-events:none;z-index:1}
    /* 轨道线：远端略淡，制造光照透视 */
    .tr-ring{position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:2;
      -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.45),#000 58%);
              mask-image:linear-gradient(180deg,rgba(0,0,0,.45),#000 58%)}
    .tr-ring.r2{width:87%;aspect-ratio:400/172;border:1px dashed var(--line-2,#e2e5ea)}
    .tr-ring.r1{width:57.5%;aspect-ratio:400/172;border:1px solid var(--line,#eceef2)}
    /* 中心脉冲环 */
    .tr-pulse{position:absolute;left:50%;top:53%;width:128px;height:128px;border-radius:50%;
      border:1.5px solid rgba(109,94,240,.45);opacity:0;transform:translate(-50%,-50%);
      animation:tr-pulse 3.8s ease-out infinite;z-index:45;pointer-events:none}
    .tr-pulse + .tr-pulse{animation-delay:1.9s}
    @keyframes tr-pulse{
      0%{transform:translate(-50%,-50%) scale(.62);opacity:.5}
      78%{opacity:0}
      100%{transform:translate(-50%,-50%) scale(1.62);opacity:0}
    }
    /* 彗星光点（沿轨运行） */
    .tr-comet{position:absolute;left:0;top:0;width:8px;height:8px;border-radius:50%;background:#8b7cf0;
      box-shadow:0 0 12px 3px rgba(139,124,240,.55);z-index:12;pointer-events:none;will-change:transform,opacity}
    .tr-comet.b{background:#c4b5fd;box-shadow:0 0 9px 2px rgba(196,181,253,.6)}
    /* 中心圆徽（点击显示中心介绍） */
    .tr-core{
      position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
      width:104px;height:104px;border-radius:50%;
      background:#fff;border:1px solid var(--line,#eceef2);
      box-shadow:0 4px 16px -6px rgba(17,24,39,.10),0 12px 28px -12px rgba(109,94,240,.18),0 0 0 6px var(--wash,#fafbfc);
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
      text-decoration:none;color:var(--ink,#111827);z-index:50;cursor:pointer;padding:0;font:inherit;
    }
    .tr-core.tr-sel{border-color:#c9c2f7;
      box-shadow:0 4px 16px -6px rgba(17,24,39,.10),0 12px 28px -12px rgba(109,94,240,.28),0 0 0 6px #f1edfd}
    .tr-core .tr-ci{color:#6d5ef0}
    .tr-core .tr-cl{font-size:12px;font-weight:600;line-height:1.25;text-align:center;max-width:104px}
    /* 环绕节点 */
    .tr-node{
      position:absolute;left:0;top:0;z-index:10;
      display:flex;flex-direction:column;align-items:center;gap:5px;
      text-decoration:none;will-change:transform,opacity;background:transparent;border:0;padding:0;font:inherit;cursor:pointer;
    }
    .tr-dot{
      width:48px;height:48px;border-radius:50%;
      background:#fff;border:1px solid var(--line,#eceef2);
      box-shadow:0 2px 10px -2px rgba(17,24,39,.08);
      display:grid;place-items:center;color:#6d5ef0;
      transition:border-color .2s,box-shadow .2s;
    }
    .tr-lb{font-size:12px;color:var(--sub,#6b7280);text-align:center;max-width:80px;line-height:1.3;transition:color .2s}
    .tr-node:hover .tr-dot,.tr-node:focus-visible .tr-dot,.tr-node.tr-hl .tr-dot{
      border-color:#8b7cf0;outline:none}
    .tr-node:hover .tr-lb,.tr-node.tr-hl .tr-lb{color:var(--ink,#111827)}
    /* 选中态（点击后环静止 + 高亮锁定） */
    .tr-node.tr-sel .tr-dot{
      border-color:#6d5ef0;
      box-shadow:0 6px 18px -4px rgba(109,94,240,.38),0 0 0 4px rgba(109,94,240,.10)}
    .tr-node.tr-sel .tr-lb{color:#4c3fd6;font-weight:700}
    .tr-mini{position:absolute;width:6px;height:6px;border-radius:50%;background:#c4b5fd;left:0;top:0;z-index:5;
      box-shadow:0 0 8px 1px rgba(196,181,253,.55);will-change:transform;pointer-events:none}
    @media (prefers-reduced-motion: reduce){
      .tr-stage *{animation:none!important;transition:none!important}
      .tr-pulse{opacity:.25;transform:translate(-50%,-50%) scale(1)}
    }
  `;

  function build() {
    const mount = document.getElementById('techRing');
    if (!mount) return;

    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    stage = document.createElement('div');
    stage.className = 'tr-stage';
    stage.innerHTML = [
      '<div class="tr-floor"></div>',
      '<div class="tr-ring r2"></div>',
      '<div class="tr-ring r1"></div>',
      '<div class="tr-pulse"></div><div class="tr-pulse"></div>',
      '<button type="button" class="tr-core" data-capability="overview" data-i18n-aria="tech.core" aria-pressed="false" title="ShopeX 技术中台">',
      `  <span class="tr-ci">${svg(ICONS.hub, 26)}</span>`,
      '  <span class="tr-cl" data-i18n="tech.core">ShopeX 技术中台</span>',
      '</button>'
    ].join('');
    mount.appendChild(stage);

    core = stage.querySelector('.tr-core');

    nodes = ITEMS.map((it) => {
      const n = document.createElement('button');
      n.type = 'button';
      n.className = 'tr-node';
      n.dataset.capability = it.id;
      n.setAttribute('aria-pressed', 'false');
      n.setAttribute('data-i18n-aria', it.key);
      n.innerHTML = `<span class="tr-dot">${svg(ICONS[it.icon], 22)}</span><span class="tr-lb" data-i18n="${it.key}"></span>`;
      n.addEventListener('pointerenter', () => hoverNode(n));
      n.addEventListener('pointerleave', () => unhoverNode(n));
      n.addEventListener('focus', () => hoverNode(n));
      n.addEventListener('blur', () => unhoverNode(n));
      n.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        selectNode(n, it);
      });
      stage.appendChild(n);
      return n;
    });
    minis = [0, 1, 2].map(() => {
      const m = document.createElement('i');
      m.className = 'tr-mini'; stage.appendChild(m);
      return m;
    });
    comets = [0, 1].map((i) => {
      const c = document.createElement('i');
      c.className = 'tr-comet' + (i ? ' b' : '');
      stage.appendChild(c);
      return c;
    });

    core.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCore();
    });

    // 点击空白只调整视觉速度，不取消当前能力选择。
    stage.addEventListener('click', (e) => {
      if (e.target.closest('.tr-node') || e.target.closest('.tr-core')) return;
      boostSpin();
    });

    // 悬停名称高亮（轻提示）
    stage.addEventListener('pointermove', (e) => {
      const n = e.target.closest('.tr-node');
      if (n && n !== hlNode) { unhoverNode(hlNode); hlNode = n; n.classList.add('tr-hl'); }
      else if (!n && hlNode) { unhoverNode(hlNode); }
    });
    stage.addEventListener('pointerleave', () => unhoverNode(hlNode));
    stage.addEventListener('pointerenter', () => { interactionPause = true; });
    stage.addEventListener('pointerleave', () => { interactionPause = false; });
    stage.addEventListener('focusin', () => { interactionPause = true; });
    stage.addEventListener('focusout', (event) => {
      if (!stage.contains(event.relatedTarget)) interactionPause = false;
    });
    document.addEventListener('tech:capability-select', (event) => {
      const id = event.detail?.id;
      if (!id || id === currentId) return;
      if (id === 'overview') { selectCore(); return; }
      const index = ITEMS.findIndex((item) => item.id === id);
      if (index >= 0) selectNode(nodes[index], ITEMS[index]);
    });

    if (window.__i18nApply) window.__i18nApply(document.documentElement.lang || undefined);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1e4);            // 静态：入场视为完成
      const repaint = () => { if (stage.clientWidth > 0) paint(1e4); };
      if ('ResizeObserver' in window) new ResizeObserver(repaint).observe(stage);
      document.addEventListener('visibilitychange', repaint);
    } else {
      startLoop();
    }
  }

  /* ---- 选中能力并同步到固定详情面板 ---- */
  function selectNode(n, it) {
    clearSelClass();
    sel = { n, it };
    currentId = it.id;
    n.classList.add('tr-sel');
    syncAria();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) paint(1e4);
    document.dispatchEvent(new CustomEvent('tech:capability-select', { detail: { id: currentId } }));
  }
  function selectCore() {
    clearSelClass();
    sel = { core: true };
    currentId = 'overview';
    core.classList.add('tr-sel');
    syncAria();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) paint(1e4);
    document.dispatchEvent(new CustomEvent('tech:capability-select', { detail: { id: currentId } }));
  }
  function clearSelClass() {
    if (sel && sel.n) sel.n.classList.remove('tr-sel');
    if (sel && sel.core) core.classList.remove('tr-sel');
  }
  function syncAria() {
    core.setAttribute('aria-pressed', String(currentId === 'overview'));
    nodes.forEach((node, index) => node.setAttribute('aria-pressed', String(ITEMS[index].id === currentId)));
  }

  /* ---- 悬停名称高亮（轻提示） ---- */
  let hlNode = null;
  function hoverNode(n) { if (hlNode && hlNode !== n) { hlNode.classList.remove('tr-hl'); hlNode._hlT = 0; } hlNode = n; n.classList.add('tr-hl'); n._hlT = 1; }
  function unhoverNode(n) { if (n) { n.classList.remove('tr-hl'); n._hlT = 0; } if (hlNode === n) hlNode = null; }

  /* ---- 点击加速（惯性衰减） ---- */
  function boostSpin() {
    boost = Math.min(boost + CLICK_BOOST, BOOST_MAX);
  }

  /* ---- 动画循环：优先 rAF；嵌入式 webview 可能不驱动 rAF，看门狗 300ms 无帧则切 setInterval 兜底 ---- */
  function startLoop() {
    let viaRaf = false, rafFired = false;
    const frame = (t) => { if (!viaRaf) return; tick(t); requestAnimationFrame(frame); };
    requestAnimationFrame((t) => {
      rafFired = true; viaRaf = true;
      tick(t); requestAnimationFrame(frame);
    });
    setTimeout(() => {
      if (rafFired) return;
      viaRaf = false;
      intervalMode = true;
      setInterval(() => tick(performance.now()), 33);
    }, 300);
  }

  function tick(t) {
    if (!stage || !stage.isConnected) return;
    if (!last) { last = t; born = t; }
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    // 慢速档：选中时时间流速平滑降到 15%（微动不停滞），松开平滑回全速
    const target = interactionPause ? 0 : sel ? 0.15 : 1;
    timeScale += (target - timeScale) * Math.min(1, dt * 3);
    animT += dt * timeScale;
    angle += (BASE_SPEED + boost) * dt * timeScale;
    boost *= Math.exp(-1.15 * dt);
    if (boost < 0.005) boost = 0;
    paint(animT);
  }

  const easeOut = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);

  function paint(tSec) {
    if (!stage || !stage.isConnected) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w) return;
    const cx = w / 2, cy = h * 0.53;
    const R2 = w * (w >= 560 ? 0.435 : 0.38), ry2 = R2 * 0.43;
    const R1 = w * (w >= 560 ? 0.287 : 0.25), ry1 = R1 * 0.43;

    nodes.forEach((n, i) => {
      const a = angle + (i * Math.PI * 2) / nodes.length;
      const depth = (Math.sin(a) + 1) / 2;                 // 0=最远 1=最近
      const bob = Math.sin(tSec * 1.6 + i * 1.1) * 3 * (0.4 + 0.6 * depth);
      const x = cx + Math.cos(a) * R2;
      const y = cy + Math.sin(a) * ry2 + bob;

      if (n._lift == null) n._lift = 0;
      n._lift += ((n._hlT || 0) - n._lift) * 0.18;         // 悬停起浮平滑
      const lift = n._lift;

      const bornAt = i * 0.09;
      const ease = easeOut((tSec - bornAt) / 0.5);

      const scale = (0.72 + 0.4 * depth) * (1 + 0.12 * lift) * (0.55 + 0.45 * ease);
      n.style.transform =
        `translate(${x}px, ${y - 6 * lift}px) translate(-50%,-58%) scale(${scale.toFixed(3)})`;
      n._x = x; n._y = y;
      const selected = sel && sel.n === n;
      n.style.opacity = selected ? '1' : Math.min(1, (0.32 + 0.68 * depth) * ease).toFixed(3);
      n.style.zIndex = selected ? '96' : String(8 + Math.round(depth * 84));
      n.style.filter = !selected && depth < 0.38
        ? `blur(${((0.38 - depth) * 3.6).toFixed(2)}px)` : '';
    });

    minis.forEach((m, i) => {
      const a = -angle * 0.7 + (i * Math.PI * 2) / minis.length + 0.6;
      m.style.transform = `translate(${cx + Math.cos(a) * R1 - 3}px,${cy + Math.sin(a) * ry1 - 3}px)`;
      m.style.opacity = '0.85';
    });

    comets.forEach((c, i) => {
      const outer = i === 0;
      const a = (i ? -0.42 : 0.55) * tSec + (i ? 2.4 : 0.4);
      const R = outer ? R2 : R1, ry = outer ? ry2 : ry1;
      const depth = (Math.sin(a) + 1) / 2;
      c.style.transform = `translate(${cx + Math.cos(a) * R - 4}px,${cy + Math.sin(a) * ry - 4}px) scale(${(0.7 + 0.5 * depth).toFixed(2)})`;
      c.style.opacity = (0.45 + 0.5 * depth).toFixed(2);
      c.style.zIndex = String(8 + Math.round(depth * 84));
    });

  }

  /* ---- 状态 ---- */
  let stage, core, nodes = [], minis = [], comets = [];
  let angle = -Math.PI / 2, last = 0, born = 0, boost = 0, animT = 0, timeScale = 1;
  let sel = null, currentId = null, interactionPause = false, intervalMode = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
