/* ============ 数据同源 · 拼接式 vs 一套底座 ============
 * 挂载点：<div id="dataSource"></div>
 * 引入顺序：i18n.js → tech-ring.js → data-source.js（均 defer）
 * 依赖：i18n.js 的 window.__I18N_DICTS + data-i18n 属性翻译
 * 交互：点击「模拟一次改价」→ 左列延迟逐个生效（拼接式），右列同时全变（一套底座）
 */
(function () {
  'use strict';

  var PURPLE = '#6d5ef0';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 86;
  var playing = false;

  function t(key) {
    var dicts = window.__I18N_DICTS || {};
    var d = dicts[lang] || dicts['zh-CN'] || {};
    return d[key] != null ? d[key] : key;
  }

  var lang = 'zh-CN';
  document.addEventListener('i18n:applied', function (e) {
    if (e.detail && e.detail.lang) lang = e.detail.lang;
  });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---- CSS ---- */
  var CSS = [
    '.dsc{margin-top:8px;font-family:inherit}',
    '.dsc-grid{display:grid;grid-template-columns:1fr 40px 1fr;gap:0 10px;align-items:stretch}',
    '.dsc-vs{align-self:center;justify-self:center;width:36px;height:36px;border-radius:50%;',
    '  border:1px solid #e2e5ea;color:#8a94a6;font-size:10px;font-weight:700;',
    '  display:flex;align-items:center;justify-content:center}',
    '.dsc-col{border:1px solid #e2e5ea;border-radius:14px;',
    '  padding:16px 16px 14px;display:flex;flex-direction:column;background:#fff}',
    '.dsc-col-tag{display:block;font-size:10px;font-weight:700;letter-spacing:.12em;',
    '  color:#6d5ef0;margin-bottom:14px;text-transform:uppercase}',
    '.dsc-note{margin-top:12px;font-size:10.5px;color:#8a94a6;line-height:1.6}',
    /* 拼图块 */
    '.dsc-ledger{display:flex;flex-direction:column;gap:14px;flex:1}',
    '.dsc-pz{position:relative;border:1px solid #d5d9e6;border-radius:10px;',
    '  padding:12px 12px 10px;background:#fff;transition:transform .3s ease,box-shadow .3s ease}',
    '.dsc-pz .nm{display:block;font-size:12.5px;font-weight:700;color:#1c2333}',
    '.dsc-pz .cp{display:inline-block;margin-top:5px;font-size:9.5px;color:#8a94a6}',
    '.dsc-pz .prc{display:inline-block;margin-top:6px;font-size:13px;font-weight:800;',
    '  color:#1c2333;font-variant-numeric:tabular-nums;padding:2px 8px;border-radius:6px;',
    '  transition:color .3s}',
    /* 咬口 */
    '.dsc-pz.tab-r::after{content:"";position:absolute;right:-11px;top:50%;',
    '  transform:translateY(-50%);width:22px;height:22px;border-radius:50%;',
    '  background:#fff;border:1px solid #d5d9e6;border-left-color:#fff}',
    '.dsc-pz.tab-l::before{content:"";position:absolute;left:-11px;top:50%;',
    '  transform:translateY(-50%);width:22px;height:22px;border-radius:50%;',
    '  background:#fff;border:1px solid #d5d9e6;border-right-color:#fff}',
    /* 圆柱基座 */
    '.dsc-cyl-wrap{position:relative;width:100%;max-width:320px;margin:8px auto 0}',
    '.dsc-cyl-top{height:46px;border-radius:50%;',
    '  background:linear-gradient(180deg,#fff 0%,#f0f2ff 100%);',
    '  border:1.5px solid rgba(109,94,240,.35)}',
    '.dsc-cyl-body{height:44px;margin-top:-22px;',
    '  background:linear-gradient(90deg,rgba(109,94,240,.14) 0%,#fff 28% 72%,rgba(109,94,240,.14) 100%);',
    '  border-left:1.5px solid rgba(109,94,240,.25);border-right:1.5px solid rgba(109,94,240,.25)}',
    '.dsc-cyl-btm{height:40px;margin-top:-22px;border-radius:50%;',
    '  background:linear-gradient(180deg,#f0f2ff,color-mix(in srgb,#6d5ef0 20%,#fff));',
    '  border:1.5px solid rgba(109,94,240,.3);box-shadow:0 10px 20px -12px rgba(109,94,240,.3)}',
    '.dsc-cyl-label{text-align:center;font-size:13px;font-weight:800;color:#1c2333;margin:-8px 0 4px}',
    '.dsc-cyl-mods{display:grid;grid-template-columns:repeat(3,1fr);gap:4px 6px;padding:0 14px}',
    '.dsc-cyl-mods span{font-size:9px;font-weight:600;color:#5b6472;text-align:center}',
    /* 端牌 */
    '.dsc-floats{display:flex;flex-direction:column;gap:14px;flex:1}',
    '.dsc-float{position:relative;border:1px solid #d5d9e6;border-radius:10px;',
    '  padding:12px 12px 10px;background:#fff;transition:transform .3s ease,box-shadow .3s ease}',
    '.dsc-float .nm{display:block;font-size:12.5px;font-weight:700;color:#1c2333}',
    '.dsc-float .cp{display:inline-block;margin-top:5px;font-size:9.5px;color:#8a94a6}',
    '.dsc-float .prc{display:inline-block;margin-top:6px;font-size:13px;font-weight:800;',
    '  color:#6d5ef0;font-variant-numeric:tabular-nums;padding:2px 8px;border-radius:6px}',
    /* 演示状态 */
    '.dsc-pz.waiting .prc,.dsc-float.waiting .prc{color:#e5484d;font-size:10.5px}',
    '.dsc-pz.done .prc,.dsc-float.done .prc{color:#6d5ef0;font-weight:800}',
    '.dsc-flash{animation:dsc-flash .8s ease}',
    '@keyframes dsc-flash{0%{background:rgba(109,94,240,.15)}100%{background:transparent}}',
    /* 播放按钮 */
    '.dsc-play{display:inline-flex;align-items:center;gap:6px;border-radius:999px;',
    '  padding:11px 26px;font-size:13px;font-weight:700;cursor:pointer;border:0;',
    '  background:#1c2333;color:#fff;font-variant-numeric:tabular-nums;',
    '  transition:transform .15s,opacity .2s}',
    '.dsc-play:hover{transform:translateY(-1px)}',
    '.dsc-play:disabled{opacity:.5;cursor:default;transform:none}'
  ].join('\n');

  /* ---- 数据 ---- */
  var SYSTEMS = [
    { name: '商城系统', copy: '独立数据拷贝' },
    { name: '后台管理系统', copy: '独立数据拷贝' },
    { name: '财务系统', copy: '独立数据拷贝' }
  ];
  var MODULES = [
    '主数据', '规则引擎', '状态机', '身份权限', '配置中心', '审计日志'
  ];

  /* ---- DOM 构建 ---- */
  function build(host) {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var grid = el('div', 'dsc-grid');

    /* 左列：拼接式 */
    var colL = el('div', 'dsc-col');
    colL.id = 'dsLeft';
    colL.appendChild(el('div', 'dsc-col-tag', t('ds.tag.a')));
    var ledger = el('div', 'dsc-ledger');
    SYSTEMS.forEach(function (s) {
      var pz = el('div', 'dsc-pz');
      pz.appendChild(el('span', 'nm', s.name));
      pz.appendChild(el('span', 'cp', s.copy));
      pz.appendChild(el('span', 'prc', '¥86'));
      ledger.appendChild(pz);
    });
    colL.appendChild(ledger);
    colL.appendChild(el('div', 'dsc-note', t('ds.left.foot')));
    grid.appendChild(colL);

    /* 中间 VS */
    grid.appendChild(el('div', 'dsc-vs', 'VS'));

    /* 右列：一套底座（圆柱） */
    var colR = el('div', 'dsc-col');
    colR.id = 'dsRight';
    colR.appendChild(el('div', 'dsc-col-tag', t('ds.tag.b')));
    var cylWrap = el('div', 'dsc-cyl-wrap');
    cylWrap.appendChild(el('div', 'dsc-cyl-top'));
    cylWrap.appendChild(el('div', 'dsc-cyl-body'));
    cylWrap.appendChild(el('div', 'dsc-cyl-btm'));
    cylWrap.appendChild(el('div', 'dsc-cyl-label', t('ds.right.label')));
    var cylMods = el('div', 'dsc-cyl-mods');
    MODULES.forEach(function (m) { cylMods.appendChild(el('span', null, m)); });
    cylWrap.appendChild(cylMods);
    colR.appendChild(cylWrap);
    grid.appendChild(colR);

    /* 播放按钮 + 状态行 */
    var btnRow = el('div', 'dsc-btn-row');
    var playBtn = el('button', 'dsc-play', t('ds.play'));
    playBtn.id = 'dsPlay';
    btnRow.appendChild(playBtn);
    var stA = el('span', 'dsc-st', t('ds.a.st1'));
    stA.id = 'dsStA';
    var stB = el('span', 'dsc-st', t('ds.b.st1'));
    stB.id = 'dsStB';
    btnRow.appendChild(stA);
    btnRow.appendChild(stB);
    grid.appendChild(btnRow);

    host.appendChild(grid);
  }

  /* ---- 演示 ---- */
  function play() {
    if (playing) return;
    playing = true;
    var to = cur === 86 ? 92 : 86;
    var from = cur;
    cur = to;

    var btn = document.getElementById('dsPlay');
    var stA = document.getElementById('dsStA');
    var stB = document.getElementById('dsStB');
    var leftPrices = document.querySelectorAll('#dsLeft .dsc-pz .prc');
    var rightPrices = document.querySelectorAll('#dsRight .dsc-pz .prc');

    btn.disabled = true;
    btn.textContent = t('ds.running');
    stA.textContent = t('ds.a.st1');
    stB.textContent = t('ds.b.st1');

    /* 右列（一套底座）：瞬时全变 */
    rightPrices.forEach(function (el) { el.textContent = '¥' + to; el.classList.add('dsc-flash'); });
    setTimeout(function () { rightPrices.forEach(function (el) { el.classList.remove('dsc-flash'); }); }, 900);

    /* 左列（拼接式）：逐个延迟生效 */
    leftPrices.forEach(function (el, i) {
      var delay = 500 + i * 800;
      setTimeout(function () {
        el.textContent = t('ds.syncing');
        el.classList.add('waiting');
      }, delay);
      setTimeout(function () {
        el.textContent = '¥' + to;
        el.classList.remove('waiting');
        if (i === leftPrices.length - 1) {
          btn.disabled = false;
          btn.textContent = t('ds.again') + ': ¥' + to + ' ⇄ ¥' + (to === 92 ? 86 : 92);
          stA.textContent = t('ds.a.st2');
          stB.textContent = t('ds.b.st2');
        }
      }, delay + 700);
    });
  }

  /* ---- 初始化 ---- */
  function init() {
    var host = document.getElementById('dataSource');
    if (!host) return;
    build(host);
    var playBtn = document.getElementById('dsPlay');
    if (playBtn) {
      playBtn.addEventListener('click', function () { play(); });
    }
  }

  /* defer 脚本按序执行，DOM 已就绪 */
  init();
})();
