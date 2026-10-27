import MODE_I18N from '../i18n/business-modes.js';

/* ============ WHAT · 四种经营模式选择器 ============
 * 四模式切换 + 独立关系拓扑 + 货 / 客 / 权联动 + 固定统一底座。
 * SVG 只负责关系线；角色节点保留为 HTML，支持多语言换行和响应式布局。
 */
(function () {
  'use strict';

  const RIGHTS = ['goods', 'customers', 'rules'];
  const LENSES = ['overview', ...RIGHTS];
  const FOUNDATION = ['products', 'pricing', 'orders', 'inventory', 'settlement'];
  const MODES = [
    {
      id: 'b2b', code: 'B2B', caps: ['price', 'credit', 'bulk', 'rebate', 'overseas'],
      nodes: [
        { id: 'brand', key: 'brand', lenses: 'goods customers rules', owners: 'goods customers rules' },
        { id: 'buyers', key: 'buyers', lenses: 'goods customers rules', owners: '' },
      ],
      edges: [
        { from: 'brand', to: 'buyers', kind: 'goods', offset: 5 },
        { from: 'brand', to: 'buyers', kind: 'rules', offset: -5 },
      ],
    },
    {
      id: 's2b2b', code: 'S2B2B', caps: ['catalog', 'access', 'compare', 'fulfill'],
      nodes: [
        { id: 'supplier', key: 'supplier', lenses: 'goods rules', owners: 'goods' },
        { id: 'manufacturer', key: 'manufacturer', lenses: 'goods rules', owners: 'goods' },
        { id: 'leader', key: 'leader', lenses: 'goods customers rules', owners: 'goods customers rules' },
        { id: 'distributor', key: 'distributor', lenses: 'goods customers rules', owners: '' },
        { id: 'retailer', key: 'retailer', lenses: 'goods customers rules', owners: '' },
      ],
      edges: [
        { from: 'supplier', to: 'leader', kind: 'goods', offset: 4 },
        { from: 'manufacturer', to: 'leader', kind: 'goods', offset: 4 },
        { from: 'leader', to: 'distributor', kind: 'goods', offset: 4 },
        { from: 'leader', to: 'retailer', kind: 'goods', offset: 4 },
        { from: 'leader', to: 'supplier', kind: 'rules', offset: -4 },
        { from: 'leader', to: 'manufacturer', kind: 'rules', offset: -4 },
        { from: 'leader', to: 'distributor', kind: 'rules', offset: -4 },
        { from: 'leader', to: 'retailer', kind: 'rules', offset: -4 },
      ],
    },
    {
      id: 'b2b2c', code: 'B2B2C', caps: ['merchant', 'campaign', 'audit', 'risk'],
      nodes: [
        { id: 'merchant', key: 'merchant', lenses: 'goods rules', owners: 'goods' },
        { id: 'platform', key: 'platform', lenses: 'customers rules', owners: 'customers rules' },
        { id: 'buyer', key: 'buyer', lenses: 'goods customers rules', owners: '' },
      ],
      edges: [
        { from: 'merchant', to: 'buyer', kind: 'goods', offset: 0 },
        { from: 'platform', to: 'merchant', kind: 'rules', offset: 0 },
        { from: 'platform', to: 'buyer', kind: 'rules', offset: 0 },
      ],
    },
    {
      id: 'b2d2b', code: 'B2D2B', caps: ['whitelabel', 'catalog', 'autonomy', 'multibrand'],
      nodes: [
        { id: 'brand', key: 'brand', lenses: 'goods rules', owners: 'goods rules' },
        { id: 'dealer', key: 'dealer', lenses: 'goods customers rules', owners: 'customers rules' },
        { id: 'customer', key: 'customer', lenses: 'goods customers rules', owners: '' },
      ],
      edges: [
        { from: 'brand', to: 'dealer', kind: 'goods', offset: 5 },
        { from: 'dealer', to: 'customer', kind: 'goods', offset: 5 },
        { from: 'brand', to: 'dealer', kind: 'rules', offset: -5 },
        { from: 'dealer', to: 'customer', kind: 'rules', offset: -5 },
      ],
    },
  ];

  const root = document.getElementById('mode-explorer');
  if (!root) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const zh = (key) => MODE_I18N['zh-CN'][key] || key;
  const text = (key, className = '') => `<span class="${className}" data-i18n="${key}">${zh(key)}</span>`;

  const rightControls = (mode) => RIGHTS.map((right) => `
    <button class="mode-right-button" type="button" data-lens-select="${right}" aria-pressed="false">
      <span class="mode-right-label">${text(`modes.${right}`)}</span>
      <span class="mode-right-value">${text(`mode.${mode.id}.rights.${right}`)}</span>
    </button>`).join('');

  const lensControls = () => LENSES.map((lens, index) => `
    <button class="mode-lens${index === 0 ? ' on' : ''}" type="button" data-lens-select="${lens}" aria-pressed="${index === 0}">
      ${text(`modes.lens.${lens}`)}
    </button>`).join('');

  const nodeBadges = () => RIGHTS.map((right) => `
    <span class="mode-node-badge mode-node-badge--${right}" data-i18n="modes.lens.${right}" aria-hidden="true">${zh(`modes.lens.${right}`)}</span>`).join('');

  const graphMarkup = (mode) => `
    <div class="mode-business-head">
      <div class="mode-label">${text('modes.chain')}</div>
      <div class="mode-lenses" role="group" data-i18n-aria="modes.lens.aria" aria-label="${zh('modes.lens.aria')}">
        ${lensControls()}
      </div>
    </div>
    <div class="mode-graph" data-mode-graph="${mode.id}" data-lens="overview">
      <svg class="mode-edges" aria-hidden="true" focusable="false"></svg>
      <div class="mode-nodes mode-nodes--${mode.id}">
        ${mode.nodes.map((node) => `
          <div class="mode-node" data-node="${node.id}" data-lenses="${node.lenses}" data-owners="${node.owners}">
            ${text(`mode.${mode.id}.chain.${node.key}`, 'mode-node-name')}
            ${nodeBadges()}
          </div>`).join('')}
      </div>
    </div>
    <div class="mode-graph-meta">
      <div class="mode-legend" aria-hidden="true">
        <span class="mode-legend-item mode-legend-item--goods">${text('modes.legend.goods')}</span>
        <span class="mode-legend-item mode-legend-item--rules">${text('modes.legend.rules')}</span>
      </div>
      <p class="mode-graph-hint">${text('modes.graph.hint')}</p>
    </div>`;

  root.innerHTML = `
    <svg class="mode-svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <marker id="mode-edge-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 8 4 0 8Z" fill="var(--faint)"/></marker>
        <marker id="mode-edge-arrow-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 8 4 0 8Z" fill="var(--ink)"/></marker>
        <marker id="mode-edge-arrow-muted" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 8 4 0 8Z" fill="var(--line-2)"/></marker>
      </defs>
    </svg>
    <div class="mode-tabs" role="tablist" data-i18n-aria="modes.aria" aria-label="${zh('modes.aria')}">
      ${MODES.map((mode, index) => {
        const key = `mode.${mode.id}`;
        return `<button class="mode-tab${index === 0 ? ' on' : ''}" id="mode-tab-${mode.id}" type="button" role="tab" data-mode="${mode.id}" aria-selected="${index === 0}" aria-controls="mode-panel-${mode.id}" tabindex="${index === 0 ? '0' : '-1'}">
          <span class="mode-tab-meta"><span class="mode-tab-code">${mode.code}</span></span>
          ${text(`${key}.name`, 'mode-tab-name')}
          ${text(`${key}.role`, 'mode-tab-role')}
          <span class="mode-tab-indicator" aria-hidden="true"><span></span></span>
        </button>`;
      }).join('')}
    </div>

    <div class="mode-stage">
      <div class="mode-panels">
        ${MODES.map((mode, index) => {
          const key = `mode.${mode.id}`;
          return `<div class="mode-panel${index === 0 ? ' on' : ''}" id="mode-panel-${mode.id}" role="tabpanel" aria-labelledby="mode-tab-${mode.id}" data-panel="${mode.id}" tabindex="0"${index === 0 ? '' : ' hidden'}>
            <div class="mode-panel-head">
              <div class="mode-panel-kicker"><span class="mode-panel-code">${mode.code}</span><i aria-hidden="true"></i>${text(`${key}.role`)}</div>
              <h4>${text(`${key}.quote`)}</h4>
              <p>${text(`${key}.desc`)}</p>
            </div>
            <div class="mode-panel-grid">
              <div class="mode-business">
                ${graphMarkup(mode)}
                <div class="mode-label mode-cap-label">${text('modes.capabilities')}</div>
                <div class="mode-caps">${mode.caps.map((cap) => text(`${key}.cap.${cap}`)).join('')}</div>
              </div>
              <div class="mode-rights">
                <div class="mode-label">${text('modes.rights')}</div>
                <div class="mode-rights-list">${rightControls(mode)}</div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="mode-foundation">
        <div class="mode-foundation-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>
          ${text('modes.base.title')}
        </div>
        <div class="mode-foundation-modules">${FOUNDATION.map((module) => text(`modes.base.${module}`)).join('')}</div>
        <div class="mode-foundation-badge"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 10 3 3 7-7"/></svg>${text('modes.base.badge')}</div>
      </div>

      ${MODES.map((mode, index) => {
        const key = `mode.${mode.id}`;
        return `<div class="mode-panel-foot" data-footer="${mode.id}"${index === 0 ? '' : ' hidden'}>
          <p class="mode-fit"><span>${text('modes.fit')}</span><strong>${text(`${key}.fit`)}</strong></p>
          <div class="mode-actions">
            <button class="mode-primary" type="button" data-mode-cta="${mode.id}">${text('modes.cta')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg></button>
            <a class="mode-secondary" href="#arch">${text('modes.arch')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
          </div>
        </div>`;
      }).join('')}
    </div>

    <p class="mode-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12.5 11 15.5 16.5 9"/><circle cx="12" cy="12" r="9"/></svg><span>${text('modes.note')}</span></p>`;

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const footers = [...root.querySelectorAll('[data-footer]')];
  let currentMode = null;
  let currentLens = 'overview';
  let renderFrame = 0;

  const activePanel = () => panels.find((panel) => panel.dataset.panel === currentMode);

  function clearTrace(path) {
    path.classList.remove('is-tracing');
    path.style.removeProperty('--edge-length');
    path.style.removeProperty('--edge-delay');
    if (path.__modeTraceEnd) {
      path.removeEventListener('animationend', path.__modeTraceEnd);
      path.__modeTraceEnd = null;
    }
  }

  function cancelTraces() {
    root.querySelectorAll('.mode-edge.is-tracing').forEach(clearTrace);
  }

  function traceGoods(panel) {
    cancelTraces();
    if (!panel || reducedMotion.matches || currentLens !== 'goods') return;
    panel.querySelectorAll('.mode-edge.is-active[data-kind="goods"]').forEach((path, index) => {
      const length = path.getTotalLength();
      if (!length) return;
      path.style.setProperty('--edge-length', String(length));
      path.style.setProperty('--edge-delay', `${index * 35}ms`);
      path.__modeTraceEnd = () => clearTrace(path);
      path.addEventListener('animationend', path.__modeTraceEnd, { once: true });
      path.classList.add('is-tracing');
    });
  }

  function applyLensState() {
    root.dataset.lens = currentLens;
    root.querySelectorAll('[data-lens-select]').forEach((button) => {
      const on = button.dataset.lensSelect === currentLens;
      button.classList.toggle('on', on);
      button.setAttribute('aria-pressed', String(on));
    });
    root.querySelectorAll('.mode-graph').forEach((graph) => {
      graph.dataset.lens = currentLens;
      graph.querySelectorAll('.mode-edge').forEach((edge) => {
        const active = currentLens !== 'overview' && edge.dataset.kind === currentLens;
        const muted = currentLens !== 'overview' && !active;
        edge.classList.toggle('is-active', active);
        edge.classList.toggle('is-muted', muted);
        const marker = active ? 'active' : (muted ? 'muted' : 'default');
        edge.setAttribute('marker-end', `url(#mode-edge-arrow${marker === 'default' ? '' : `-${marker}`})`);
      });
    });
  }

  function selectLens(lens, animate = true) {
    if (!LENSES.includes(lens)) return;
    if (lens === currentLens) {
      if (animate && lens === 'goods') traceGoods(activePanel());
      return;
    }
    cancelTraces();
    currentLens = lens;
    applyLensState();
    if (animate) traceGoods(activePanel());
  }

  function edgeGeometry(source, target, graphRect, offset) {
    const sourceCenter = {
      x: source.left - graphRect.left + source.width / 2,
      y: source.top - graphRect.top + source.height / 2,
    };
    const targetCenter = {
      x: target.left - graphRect.left + target.width / 2,
      y: target.top - graphRect.top + target.height / 2,
    };
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const normal = { x: -dy / distance, y: dx / distance };
    const shift = { x: normal.x * offset, y: normal.y * offset };
    const vertical = Math.abs(dy) > Math.abs(dx) * 0.72;
    let start;
    let end;
    let control1;
    let control2;

    if (vertical) {
      const direction = dy >= 0 ? 1 : -1;
      start = {
        x: sourceCenter.x + shift.x,
        y: (direction > 0 ? source.bottom - graphRect.top : source.top - graphRect.top) + shift.y,
      };
      end = {
        x: targetCenter.x + shift.x,
        y: (direction > 0 ? target.top - graphRect.top : target.bottom - graphRect.top) + shift.y,
      };
      const bend = Math.min(80, Math.max(6, Math.abs(end.y - start.y) * 0.45)) * direction;
      control1 = { x: start.x, y: start.y + bend };
      control2 = { x: end.x, y: end.y - bend };
    } else {
      const direction = dx >= 0 ? 1 : -1;
      start = {
        x: (direction > 0 ? source.right - graphRect.left : source.left - graphRect.left) + shift.x,
        y: sourceCenter.y + shift.y,
      };
      end = {
        x: (direction > 0 ? target.left - graphRect.left : target.right - graphRect.left) + shift.x,
        y: targetCenter.y + shift.y,
      };
      const bend = Math.min(80, Math.max(6, Math.abs(end.x - start.x) * 0.45)) * direction;
      control1 = { x: start.x + bend, y: start.y };
      control2 = { x: end.x - bend, y: end.y };
    }

    const point = (value) => `${value.x.toFixed(1)} ${value.y.toFixed(1)}`;
    return `M ${point(start)} C ${point(control1)}, ${point(control2)}, ${point(end)}`;
  }

  function renderGraph(panel, animate = false) {
    cancelTraces();
    if (!panel || panel.hidden) return;
    const mode = MODES.find((item) => item.id === panel.dataset.panel);
    const graph = panel.querySelector('.mode-graph');
    const svg = graph.querySelector('.mode-edges');
    const graphRect = graph.getBoundingClientRect();
    if (!graphRect.width || !graphRect.height) return;

    svg.setAttribute('viewBox', `0 0 ${graphRect.width} ${graphRect.height}`);
    svg.replaceChildren();
    const namespace = 'http://www.w3.org/2000/svg';
    mode.edges.forEach((edge) => {
      const sourceNode = graph.querySelector(`[data-node="${edge.from}"]`);
      const targetNode = graph.querySelector(`[data-node="${edge.to}"]`);
      if (!sourceNode || !targetNode) return;
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute('d', edgeGeometry(sourceNode.getBoundingClientRect(), targetNode.getBoundingClientRect(), graphRect, edge.offset || 0));
      path.setAttribute('class', 'mode-edge');
      path.setAttribute('data-kind', edge.kind);
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      path.setAttribute('aria-hidden', 'true');
      svg.appendChild(path);
    });
    applyLensState();
    if (animate) traceGoods(panel);
  }

  function scheduleRender(panel, animate = false) {
    window.cancelAnimationFrame(renderFrame);
    renderFrame = window.requestAnimationFrame(() => renderGraph(panel, animate));
  }

  function selectMode(id, moveFocus = false) {
    if (!MODES.some((mode) => mode.id === id)) return;
    const changed = currentMode !== id;
    currentMode = id;
    root.dataset.activeMode = id;
    tabs.forEach((tab) => {
      const on = tab.dataset.mode === id;
      tab.classList.toggle('on', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && moveFocus) tab.focus();
    });
    panels.forEach((panel) => {
      const on = panel.dataset.panel === id;
      panel.hidden = !on;
      panel.classList.toggle('on', on);
    });
    footers.forEach((footer) => {
      footer.hidden = footer.dataset.footer !== id;
    });
    if (changed) scheduleRender(activePanel(), currentLens === 'goods');
  }

  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) selectMode(tab.dataset.mode);
    const lens = event.target.closest('[data-lens-select]');
    if (lens) selectLens(lens.dataset.lensSelect);
    const cta = event.target.closest('[data-mode-cta]');
    if (cta && window.__openLeadDialog) window.__openLeadDialog(cta.dataset.modeCta);
  });

  root.querySelector('[role="tablist"]').addEventListener('keydown', (event) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next == null) return;
    event.preventDefault();
    selectMode(tabs[next].dataset.mode, true);
  });

  document.addEventListener('i18n:applied', () => scheduleRender(activePanel()));
  if (document.fonts?.ready) document.fonts.ready.then(() => scheduleRender(activePanel()));

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver((entries) => {
      const panel = activePanel();
      if (panel && entries.some((entry) => entry.target === panel.querySelector('.mode-graph'))) {
        scheduleRender(panel);
      }
    });
    panels.forEach((panel) => observer.observe(panel.querySelector('.mode-graph')));
  } else {
    window.addEventListener('resize', () => scheduleRender(activePanel()), { passive: true });
  }

  selectMode('b2b');
  applyLensState();
  scheduleRender(activePanel());
})();
