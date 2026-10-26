import MODE_I18N from '../i18n/business-modes.js';

/* ============ WHAT · 四种经营模式选择器 ============
 * 内容模型：专业代号 + 中文业务名 + 采购价值；角色链路 + 货 / 客 / 权 + 关键能力。
 * 词典通过 ES Module 共享，组件只负责渲染与交互。
 */
(function () {

  const MODES = [
    { id: 'b2b', code: 'B2B', chain: ['brand', 'buyers'], caps: ['price', 'credit', 'bulk', 'rebate', 'overseas'] },
    { id: 's2b2b', code: 'S2B2B', chain: ['supply', 'leader', 'channel'], caps: ['catalog', 'access', 'compare', 'fulfill'] },
    { id: 'b2b2c', code: 'B2B2C', chain: ['merchant', 'platform', 'buyer'], caps: ['merchant', 'campaign', 'audit', 'risk'] },
    { id: 'b2d2b', code: 'B2D2B', chain: ['brand', 'dealer', 'customer'], caps: ['whitelabel', 'catalog', 'autonomy', 'multibrand'] },
  ];

  const root = document.getElementById('mode-explorer');
  if (!root) return;
  const zh = (key) => MODE_I18N['zh-CN'][key] || key;
  const text = (key, className = '') => `<span class="${className}" data-i18n="${key}">${zh(key)}</span>`;
  const arrow = '<svg class="mode-chain-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>';

  const rights = (mode, compare = false) => ['goods', 'customers', 'rules'].map((right) => `
    <div class="mode-right${compare ? ' compare-right' : ''}">
      <dt>${text(`modes.${right}`)}</dt>
      <dd>${text(`mode.${mode.id}.rights.${right}`)}</dd>
    </div>`).join('');

  root.innerHTML = `
    <div class="mode-tabs" role="tablist" data-i18n-aria="modes.aria" aria-label="${zh('modes.aria')}">
      ${MODES.map((mode, index) => {
        const key = `mode.${mode.id}`;
        return `<button class="mode-tab${index === 0 ? ' on' : ''}" id="mode-tab-${mode.id}" type="button" role="tab" data-mode="${mode.id}" aria-selected="${index === 0}" aria-controls="mode-panel-${mode.id}" tabindex="${index === 0 ? '0' : '-1'}">
          <span class="mode-tab-meta"><span class="mode-tab-code">${mode.code}</span></span>
          ${text(`${key}.name`, 'mode-tab-name')}
          ${text(`${key}.quote`, 'mode-tab-quote')}
          <span class="mode-tab-indicator" aria-hidden="true"><span></span></span>
        </button>`;
      }).join('')}
    </div>

    <div class="mode-stage">
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
              <div class="mode-label">${text('modes.chain')}</div>
              <div class="mode-chain">
                ${mode.chain.map((node, i) => `${i ? arrow : ''}<div class="mode-chain-node">${text(`${key}.chain.${node}`)}</div>`).join('')}
              </div>
              <div class="mode-label mode-cap-label">${text('modes.capabilities')}</div>
              <div class="mode-caps">${mode.caps.map((cap) => text(`${key}.cap.${cap}`)).join('')}</div>
            </div>
            <div class="mode-rights">
              <div class="mode-label">${text('modes.rights')}</div>
              <dl>${rights(mode)}</dl>
            </div>
          </div>
          <div class="mode-panel-foot">
            <p class="mode-fit"><span>${text('modes.fit')}</span><strong>${text(`${key}.fit`)}</strong></p>
            <div class="mode-actions">
              <button class="mode-primary" type="button" data-mode-cta="${mode.id}">${text('modes.cta')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg></button>
              <a class="mode-secondary" href="#arch">${text('modes.arch')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <p class="mode-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12.5 11 15.5 16.5 9"/><circle cx="12" cy="12" r="9"/></svg><span>${text('modes.note')}</span></p>

    <details class="mode-compare">
      <summary><span class="mode-compare-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16M9 3v18M15 3v18"/></svg>${text('modes.compare')}</span><span class="mode-compare-hint">${text('modes.compare.hint')}</span><svg class="mode-compare-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary>
      <div class="mode-compare-grid">
        ${MODES.map((mode) => `<article class="mode-compare-card"><h4><span>${mode.code}</span>${text(`mode.${mode.id}.name`)}</h4><dl>${rights(mode, true)}</dl></article>`).join('')}
      </div>
    </details>`;

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  function selectMode(id, moveFocus = false) {
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
  }

  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) selectMode(tab.dataset.mode);
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
})();
