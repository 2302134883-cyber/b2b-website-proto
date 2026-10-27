(function () {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('m-nav');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLang = document.getElementById('mobileLang');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menus = [...document.querySelectorAll('.site-header md-menu[anchor]')];
  const navPanelItems = [...document.querySelectorAll('.site-desktop-nav .site-nav-item')];

  function closeNavPanels() {
    navPanelItems.forEach((item) => {
      item.querySelector('.site-nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  window.__closeSiteNavPanels = closeNavPanels;
  navPanelItems.forEach((item) => {
    const trigger = item.querySelector('.site-nav-trigger');
    item.addEventListener('mouseenter', () => {
      closeMenus(); closeNavPanels(); trigger?.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', () => trigger?.setAttribute('aria-expanded', 'false'));
    item.addEventListener('focusin', () => {
      closeMenus(); closeNavPanels(); trigger?.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) trigger?.setAttribute('aria-expanded', 'false');
    });
  });

  const techItem = document.querySelector('.site-nav-item--tech');
  const techPanel = document.getElementById('nav-panel-tech');
  const headerActions = document.querySelector('.site-header-actions');
  function alignTechPanelCaret() {
    if (!techItem || !techPanel || !headerActions) return;
    const actionsRect = headerActions.getBoundingClientRect();
    const itemRect = techItem.getBoundingClientRect();
    const center = itemRect.left + itemRect.width / 2;
    techPanel.style.setProperty('--site-nav-caret-right', Math.round(actionsRect.right - center - 5) + 'px');
  }
  window.addEventListener('resize', alignTechPanelCaret);
  document.addEventListener('i18n:applied', () => requestAnimationFrame(alignTechPanelCaret));
  window.addEventListener('load', alignTechPanelCaret);
  alignTechPanelCaret();

  const aboutItem = document.querySelector('.site-nav-item--about');
  const aboutPanel = document.getElementById('nav-panel-about');
  function alignAboutPanelCaret() {
    if (!aboutItem || !aboutPanel || !headerActions) return;
    const actionsRect = headerActions.getBoundingClientRect();
    const itemRect = aboutItem.getBoundingClientRect();
    const center = itemRect.left + itemRect.width / 2;
    aboutPanel.style.setProperty('--site-nav-about-caret-right', Math.round(actionsRect.right - center - 5) + 'px');
  }
  window.addEventListener('resize', alignAboutPanelCaret);
  document.addEventListener('i18n:applied', () => requestAnimationFrame(alignAboutPanelCaret));
  window.addEventListener('load', alignAboutPanelCaret);
  alignAboutPanelCaret();

  function closeMenus(except) {
    menus.forEach((menu) => {
      if (menu === except) return;
      menu.open = false;
      const trigger = document.getElementById(menu.getAttribute('anchor'));
      trigger?.setAttribute('aria-expanded', 'false');
    });
  }
  menus.forEach((menu) => {
    const trigger = document.getElementById(menu.getAttribute('anchor'));
    if (!trigger) return;
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      closeNavPanels();
      const open = !menu.open;
      closeMenus(menu);
      menu.open = open;
      trigger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('closed', () => trigger.setAttribute('aria-expanded', 'false'));
  });

  function closeMobileNav() {
    if (!mobileNav || !mobileToggle) return;
    mobileNav.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
  window.__closeSiteMobileNav = closeMobileNav;
  mobileToggle?.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    mobileToggle.setAttribute('aria-expanded', String(open));
    if (open) { closeMenus(); closeNavPanels(); }
  });
  mobileNav?.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', () => { closeMobileNav(); closeMenus(); });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenus();
    closeNavPanels();
    if (document.activeElement?.closest('.site-desktop-nav .site-nav-item')) document.activeElement.blur();
    if (mobileNav && !mobileNav.hidden) {
      closeMobileNav();
      mobileToggle?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (mobileNav && !mobileNav.hidden && header && !header.contains(event.target)) closeMobileNav();
  });

  function scrollToTarget(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    closeMenus();
    closeNavPanels();
    closeMobileNav();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', selector); } catch (e) { /* file:// 等环境下保留滚动行为即可 */ }
  }
  document.addEventListener('click', (event) => {
    const item = event.target.closest?.('[data-header-target]');
    if (!item || item.hasAttribute('data-tech-capability')) return;
    event.preventDefault();
    scrollToTarget(item.getAttribute('data-header-target'));
  });
  document.addEventListener('click', (event) => {
    const item = event.target.closest?.('[data-case-menu]');
    if (!item) return;
    event.preventDefault();
    const tabs = document.querySelectorAll('#caseChain .cc-node');
    tabs[Number(item.getAttribute('data-case-menu'))]?.click();
    tabs[Number(item.getAttribute('data-case-menu'))]?.focus({ preventScroll: true });
    closeMenus();
    closeNavPanels();
    closeMobileNav();
    document.getElementById('caseStudies')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', '#caseStudies'); } catch (e) { /* file:// 下保留滚动 */ }
  });
  document.querySelectorAll('.site-header a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => { closeMenus(); closeNavPanels(); closeMobileNav(); });
  });
  mobileLang?.addEventListener('change', () => {
    window.__i18nApply?.(mobileLang.value);
    closeMobileNav();
  });
  document.addEventListener('i18n:applied', (event) => {
    if (mobileLang && event.detail?.lang) mobileLang.value = event.detail.lang;
  });

  const sectionMap = [
    ['sec-what', 'product'], ['what-pricing', 'pricing'], ['industrySolutions', 'solution'],
    ['caseStudies', 'cases'], ['sec-how', 'tech'], ['aiAgent', 'ai'], ['sec-about', 'about'],
  ];
  const navItems = [...document.querySelectorAll('[data-nav-section]')];
  let scrollTicking = false;
  function updateActiveNav() {
    const marker = window.scrollY + 112;
    let active = '';
    sectionMap.forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= marker) active = key;
    });
    navItems.forEach((item) => item.classList.toggle('is-active', item.getAttribute('data-nav-section') === active));
    scrollTicking = false;
  }
  function requestActiveNav() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateActiveNav);
  }
  window.addEventListener('scroll', requestActiveNav, { passive: true });
  window.addEventListener('resize', requestActiveNav);
  window.addEventListener('load', updateActiveNav);
  updateActiveNav();
})();
