/* ============ TECH · 主从联动：能力选择 → 固定详情 → 场景验证 ============ */
(function () {
  'use strict';

  const root = document.getElementById('techCapabilities');
  const tabsRoot = document.getElementById('techCapabilityTabs');
  const detail = document.getElementById('techDetail');
  const scene = document.getElementById('how-data');
  if (!root || !tabsRoot || !detail || !scene) return;

  const CAPABILITIES = [
    { id: 'data', key: 'tech.1', dkey: 'tech.d.1', index: 1 },
    { id: 'integration', key: 'tech.2', dkey: 'tech.d.2', index: 2 },
    { id: 'microservices', key: 'tech.3', dkey: 'tech.d.3', index: 3 },
    { id: 'cloud', key: 'tech.4', dkey: 'tech.d.4', index: 4 },
    { id: 'governance', key: 'tech.5', dkey: 'tech.d.5', index: 5 },
    { id: 'analytics', key: 'tech.6', dkey: 'tech.d.6', index: 6 },
  ];
  const OVERVIEW = { id: 'overview', key: 'tech.core' };
  const ITEMS = [OVERVIEW, ...CAPABILITIES];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null;

  const t = (key) => (window.__i18nT && window.__i18nT(key)) || key;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const text = (key) => escapeHtml(t(key));
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function panelMarkup(item) {
    if (item.id === 'overview') {
      return `
        <p class="tc-eyebrow">${text('tech.core')}</p>
        <h4>${text('tech.core')}</h4>
        <p class="tc-summary">${text('tech.core.d')}</p>
        <div class="tc-layers">${text('tech.layers')}</div>
        <a class="tc-scene-link" href="#arch" data-header-target="#arch">${text('modes.arch')}${arrow}</a>
        <details class="tc-impl">
          <summary>${text('tech.ui.impl')}</summary>
          <p class="tc-impl-details">${text('tech.impl.details')}</p>
          <p class="tc-impl-note">${text('tech.impl.note')}</p>
        </details>`;
    }

    const facts = t(`tech.f.${item.index}`).split(' · ').map((fact) => `<span class="tc-fact">${escapeHtml(fact)}</span>`).join('');
    const sceneLink = item.id === 'data'
      ? `<button class="tc-scene-link" type="button" data-open-data-scene>${text('tech.ui.play')}${arrow}</button>`
      : '';
    return `
      <p class="tc-eyebrow">${text('tech.core')} / ${String(item.index).padStart(2, '0')}</p>
      <h4>${text(item.key)}</h4>
      <p class="tc-summary">${text(item.dkey)}</p>
      <div class="tc-facts">${facts}</div>
      <div class="tc-value"><span>${text('tech.ui.value')}</span><p>${text(`tech.k.${item.index}`)}</p></div>
      ${sceneLink}`;
  }

  ITEMS.forEach((item) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tc-tab';
    tab.id = `techTab-${item.id}`;
    tab.dataset.capability = item.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `techPanel-${item.id}`);
    tab.setAttribute('aria-selected', 'false');
    tab.tabIndex = -1;
    tabsRoot.appendChild(tab);

    const panel = document.createElement('article');
    panel.className = 'tc-panel';
    panel.id = `techPanel-${item.id}`;
    panel.dataset.panel = item.id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    panel.hidden = true;
    detail.appendChild(panel);
  });

  const tabs = [...tabsRoot.querySelectorAll('.tc-tab')];
  const panels = [...detail.querySelectorAll('.tc-panel')];

  function localize() {
    tabs.forEach((tab) => {
      const item = ITEMS.find((entry) => entry.id === tab.dataset.capability);
      tab.textContent = t(item.id === 'overview' ? 'tech.ui.overview' : item.key);
    });
    panels.forEach((panel) => {
      const item = ITEMS.find((entry) => entry.id === panel.dataset.panel);
      panel.innerHTML = panelMarkup(item);
    });
  }

  function select(id) {
    if (!ITEMS.some((item) => item.id === id)) return;
    const previous = current;
    current = id;
    root.dataset.activeCapability = id;
    tabs.forEach((tab) => {
      const on = tab.dataset.capability === id;
      tab.classList.toggle('on', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel) => {
      const on = panel.dataset.panel === id;
      panel.hidden = !on;
      panel.classList.toggle('on', on);
    });
    scene.hidden = id !== 'data';
    if (previous === 'data' && id !== 'data') {
      document.dispatchEvent(new CustomEvent('tech:data-scene-visibility', { detail: { visible: false } }));
    }
  }

  function emit(id) {
    document.dispatchEvent(new CustomEvent('tech:capability-select', { detail: { id } }));
  }

  tabsRoot.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-capability]');
    if (tab) emit(tab.dataset.capability);
  });
  tabsRoot.addEventListener('keydown', (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next == null) return;
    event.preventDefault();
    const id = tabs[next].dataset.capability;
    emit(id);
    tabs[next].focus();
  });

  detail.addEventListener('click', (event) => {
    if (!event.target.closest('[data-open-data-scene]')) return;
    scene.hidden = false;
    const heading = scene.querySelector('h4');
    if (heading) heading.focus({ preventScroll: true });
    scene.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });

  document.addEventListener('tech:capability-select', (event) => select(event.detail?.id));
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('[data-tech-capability]');
    if (!link) return;
    event.preventDefault();
    emit(link.dataset.techCapability);
    if (window.__closeSiteNavPanels) window.__closeSiteNavPanels();
    if (window.__closeSiteMobileNav) window.__closeSiteMobileNav();
    const selector = link.getAttribute('data-header-target') || link.getAttribute('href');
    const target = selector && document.querySelector(selector);
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', selector); } catch (e) { /* 保留锚点不可写时的滚动行为 */ }
  });
  document.addEventListener('i18n:applied', () => {
    const focusInside = detail.contains(document.activeElement);
    localize();
    select(current || 'data');
    if (focusInside) tabs.find((tab) => tab.dataset.capability === current)?.focus();
  });

  localize();
  emit('data');
})();
