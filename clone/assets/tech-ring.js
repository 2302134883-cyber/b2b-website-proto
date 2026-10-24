/* ============ 技术栈环形图（谷歌生态图线框风 · 立体透视版） ============
 * 用法：页面放 <div id="techRing"></div>，引入本文件（defer，需在 i18n.js 之后）。
 * 依赖：i18n.js 的 data-i18n 机制与 __i18nApply 钩子（含 'i18n:applied' 事件）。
 * 词典 key：tech.1~6（名称）、tech.d.1~6（说明）、tech.core（中心）。
 * 立体：轨道面透视倾斜，节点按 sin 深度缩放/淡出/虚化，后排穿过中心圆徽后方。
 * 动态：永不停止的双轨反向旋转（悬停不停转）+ 点击加速（惯性衰减）+ 节点浮动呼吸
 *       + 入场 stagger + 核心脉冲环 + 彗星光点沿轨运行。
 * 悬停：气泡卡浮现具体内容（跟随节点），同时全场聚焦降级。
 * 无障碍：prefers-reduced-motion 时静态呈现。
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
  const BASE_SPEED = 0.09;      // 基础角速度 rad/s
  const CLICK_BOOST = 0.9;      // 每次点击追加的角速度
  const BOOST_MAX = 2.8;        // 加速上限

  const STYLE = `
    .tr-stage{position:relative;width:100%;max-width:560px;aspect-ratio:23/20;margin:0 auto;user-select:none;cursor:pointer}
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
    /* 中心圆徽 */
    .tr-core{
      position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
      width:104px;height:104px;border-radius:50%;
      background:#fff;border:1px solid var(--line,#eceef2);
      box-shadow:0 4px 16px -6px rgba(17,24,39,.10),0 12px 28px -12px rgba(109,94,240,.18),0 0 0 6px var(--wash,#fafbfc);
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;
      text-decoration:none;color:var(--ink,#111827);z-index:50;pointer-events:none;
    }
    .tr-core .tr-ci{color:#6d5ef0}
    .tr-core .tr-cl{font-size:12px;font-weight:600;line-height:1.25;text-align:center;max-width:104px}
    /* 环绕节点 */
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
    .tr-node:hover .tr-dot,.tr-node:focus-visible .tr-dot{
      border-color:#6d5ef0;box-shadow:0 6px 18px -4px rgba(109,94,240,.38);outline:none}
    .tr-node:hover .tr-lb{color:var(--ink,#111827)}
    .tr-mini{position:absolute;width:6px;height:6px;border-radius:50%;background:#c4b5fd;left:0;top:0;z-index:5;
      box-shadow:0 0 8px 1px rgba(196,181,253,.55);will-change:transform;pointer-events:none}
    .tr-cap{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-size:12.5px;color:var(--faint,#9ca3af);text-align:center;max-width:92%;pointer-events:none;transition:opacity .25s}
    .tr-cap b{color:var(--ink,#111827);font-weight:600}
    /* 悬停气泡卡 + 聚焦降级 */
    .tr-tip{position:absolute;z-index:300;width:224px;padding:12px 14px;border-radius:14px;
      background:rgba(255,255,255,.97);border:1px solid var(--line,#eceef2);
      box-shadow:0 14px 36px -12px rgba(17,24,39,.25),0 0 0 4px rgba(109,94,240,.06);
      opacity:0;transform:translateY(8px) scale(.96);
      transition:opacity .18s ease,transform .18s ease;pointer-events:none}
    .tr-tip.on{opacity:1;transform:translateY(0) scale(1);
      transition:opacity .24s cubic-bezier(.2,.9,.3,1.15),transform .24s cubic-bezier(.2,.9,.3,1.15)}
    .tr-tip.tr-instant{transition:none!important}
    .tr-tip .tr-thd{display:flex;align-items:center;gap:9px;margin-bottom:6px}
    .tr-tip .tr-tico{width:30px;height:30px;border-radius:9px;background:#f1edfd;color:#4c3fd6;display:grid;place-items:center;flex:0 0 30px}
    .tr-tip b{font-size:13px;font-weight:600;color:var(--ink,#111827)}
    .tr-tip p{margin:0;font-size:12px;line-height:1.55;color:var(--sub,#6b7280)}
    .tr-tip .tr-tarr{position:absolute;left:50%;bottom:-5.5px;width:10px;height:10px;background:#fff;
      border-right:1px solid var(--line,#eceef2);border-bottom:1px solid var(--line,#eceef2);transform:translateX(-50%) rotate(45deg)}
    .tr-tip.flip .tr-tarr{bottom:auto;top:-5.5px;transform:translateX(-50%) rotate(225deg)}
    .tr-stage.tr-spot .tr-ring{opacity:.35}
    .tr-stage.tr-spot .tr-cap{opacity:0}
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
      '<div class="tr-core">',
      `  <span class="tr-ci">${svg(ICONS.hub, 26)}</span>`,
      '  <span class="tr-cl" data-i18n="tech.core">ShopeX 技术中台</span>',
      '</div>',
      '<div class="tr-cap"><b data-i18n="tech.core">ShopeX 技术中台</b></div>',
      '<div class="tr-tip" role="tooltip"></div>'
    ].join('');
    mount.appendChild(stage);

    cap = stage.querySelector('.tr-cap');
    tip = stage.querySelector('.tr-tip');

    nodes = ITEMS.map((it) => {
      const n = document.createElement('a');
      n.className = 'tr-node';
      n.href = it.href || '#';
      n.innerHTML = `<span class="tr-dot">${svg(ICONS[it.icon], 22)}</span><span class="tr-lb" data-i18n="${it.key}"></span>`;
      n.addEventListener('pointerenter', () => hotNode(n, it));
      n.addEventListener('pointerleave', () => coolNodeSoon(n));
      n.addEventListener('focus', () => hotNode(n, it));
      n.addEventListener('blur', () => coolNodeSoon(n));
      n.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); boostSpin(); });   // 点击节点也加速（不跳转）
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

    // 点击任意处加速旋转
    stage.addEventListener('click', () => boostSpin());
    // 指针移出舞台 → 延迟关闭气泡
    stage.addEventListener('pointerleave', () => { if (spotNode) coolNodeSoon(spotNode); });
    // 移动端：点空白处关闭气泡
    stage.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.tr-node') && spotNode) coolNode(spotNode);
    });
    // pointermove 直接追踪（覆盖 enter/leave 与 :hover 均不可靠的嵌入式 webview）
    stage.addEventListener('pointermove', (e) => {
      const n = e.target.closest('.tr-node');
      if (n && n !== spotNode) {
        const it = ITEMS[nodes.indexOf(n)];
        if (it) hotNode(n, it);
      } else if (!n && spotNode) {
        coolNodeSoon(spotNode);
      }
    });

    if (window.__i18nApply) window.__i18nApply(document.documentElement.lang || undefined);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1e4);            // 静态：入场视为完成
    } else {
      startLoop();
    }
  }

  /* ---- 悬停：气泡卡 + 聚焦降级（旋转不停） ---- */
  function hotNode(n, it) {
    clearTimeout(n._coolT);
    n._liftT = 1;
    spotNode = n;
    stage.classList.add('tr-spot');
    tip.innerHTML =
      `<span class="tr-thd"><span class="tr-tico">${svg(ICONS[it.icon], 18)}</span><b data-i18n="${it.key}"></b></span>` +
      `<p data-i18n="${it.dkey}"></p><i class="tr-tarr"></i>`;
    if (window.__i18nApply) window.__i18nApply(document.documentElement.lang || undefined);
    placeTip(n);
    tip.classList.toggle('tr-instant', intervalMode);
    setTimeout(() => tip.classList.add('on'), 0);
  }
  function coolNode(n) {
    n._liftT = 0;
    if (spotNode === n) {
      spotNode = null;
      stage.classList.remove('tr-spot');
      tip.classList.remove('on', 'tr-instant');
    }
  }
  /* 延迟关闭：Chrome 在元素位移后会补发合成 pointerleave，宽限 150ms 防止闪烁 */
  function coolNodeSoon(n) {
    clearTimeout(n._coolT);
    n._coolT = setTimeout(() => coolNode(n), 150);
  }
  function placeTip(n) {
    if (n._x == null) return;
    const w = stage.clientWidth;
    const x = Math.min(Math.max(n._x, 122), w - 122);
    const flip = n._y < 178;
    tip.classList.toggle('flip', flip);
    tip.style.left = (x - 112) + 'px';
    tip.style.top = flip ? (n._y + 56) + 'px'
                         : (n._y - 56 - tip.offsetHeight) + 'px';
  }

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
      intervalMode = true;                       // 冻结环境：禁用过渡，改为直接显形
      setInterval(() => tick(performance.now()), 33);
    }, 300);
  }

  function tick(t) {
    if (!stage || !stage.isConnected) return;
    if (!last) { last = t; born = t; }
    const tSec = (t - born) / 1000;
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    angle += (BASE_SPEED + boost) * dt;          // 旋转永不停止
    boost *= Math.exp(-1.15 * dt);               // 点击加速惯性衰减
    if (boost < 0.005) boost = 0;
    paint(tSec);
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
      n._lift += ((n._liftT || 0) - n._lift) * 0.18;       // hover 起浮平滑
      const lift = n._lift;

      const bornAt = i * 0.09;
      const ease = easeOut((tSec - bornAt) / 0.5);

      const scale = (0.72 + 0.4 * depth) * (1 + 0.12 * lift) * (0.55 + 0.45 * ease);
      n.style.transform =
        `translate(${x}px, ${y - 6 * lift}px) translate(-50%,-58%) scale(${scale.toFixed(3)})`;
      n._x = x; n._y = y;
      const dim = (spotNode && spotNode !== n) ? 0.25 : 1;
      n.style.opacity = Math.min(1, (0.32 + 0.68 * depth) * ease * dim + 0.35 * lift).toFixed(3);
      n.style.zIndex = (lift > 0 || spotNode === n) ? '200' : String(8 + Math.round(depth * 84));
      n.style.filter = depth < 0.38
        ? `blur(${((0.38 - depth) * 3.6).toFixed(2)}px)` : '';
    });

    minis.forEach((m, i) => {
      const a = -angle * 0.7 + (i * Math.PI * 2) / minis.length + 0.6;
      m.style.transform = `translate(${cx + Math.cos(a) * R1 - 3}px,${cy + Math.sin(a) * ry1 - 3}px)`;
      m.style.opacity = spotNode ? '0.3' : '0.85';
    });

    comets.forEach((c, i) => {
      const outer = i === 0;
      const a = (i ? -0.42 : 0.55) * tSec + (i ? 2.4 : 0.4);
      const R = outer ? R2 : R1, ry = outer ? ry2 : ry1;
      const depth = (Math.sin(a) + 1) / 2;
      c.style.transform = `translate(${cx + Math.cos(a) * R - 4}px,${cy + Math.sin(a) * ry - 4}px) scale(${(0.7 + 0.5 * depth).toFixed(2)})`;
      c.style.opacity = ((0.45 + 0.5 * depth) * (spotNode ? 0.3 : 1)).toFixed(2);
      c.style.zIndex = String(8 + Math.round(depth * 84));
    });

    if (spotNode && tip && tip.classList.contains('on')) placeTip(spotNode);   // 气泡跟随节点

    // 指针已离开整个舞台（以浏览器真实 :hover 为准）→ 延迟关闭
    if (spotNode && !stage.matches(':hover')) coolNodeSoon(spotNode);
  }

  /* ---- 状态 ---- */
  let stage, cap, tip, nodes = [], minis = [], comets = [];
  let angle = -Math.PI / 2, last = 0, born = 0, boost = 0;
  let spotNode = null, intervalMode = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
