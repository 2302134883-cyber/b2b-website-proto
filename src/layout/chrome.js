/* ============ 技术子页面外壳（header / footer / 章节导航） ============
 * 说明：主页面 index.html 仍内联自己的 header/footer（本轮只改「Technology」下拉）。
 * 这里为 /tech/* 提供统一外壳，改一处对全部技术子页面生效。
 *
 * 双语文案通过 data-i18n 交给 src/i18n/index.js 处理（zh-CN / en 维护，
 * 其余语言运行时回退 en）。因此本文件里写的是中文兜底文本，不参与拼装逻辑。
 */

const SITE_NAV = [
  { key: 'nav.product', label: '产品与服务', href: '/#sec-what' },
  { key: 'nav.solution', label: '行业方案', href: '/#industrySolutions' },
  { key: 'nav.cases', label: '客户案例', href: '/#caseStudies' },
  { key: 'nav.ai', label: 'AI 智能体', href: '/#aiAgent' },
  { key: 'nav.tech', label: 'Technology', href: '/tech/', active: true },
  { key: 'nav.about', label: '关于我们', href: '/#sec-about' },
];

/* Technology 栏目的四个子页面 —— 唯一数据源。
 * 新增页面只需改这里 + vite.config.js 的 pages。 */
export const TECH_PAGES = [
  { id: 'architecture', key: 'nav.tech.arch', label: '架构与技术栈', href: '/tech/' },
  { id: 'reliability', key: 'nav.tech.rel', label: '可靠性与可观测性', href: '/tech/reliability.html' },
  { id: 'security', key: 'nav.tech.sec', label: '安全与合规', href: '/tech/security.html' },
  { id: 'deployment', key: 'nav.tech.ops', label: '部署与运维', href: '/tech/deployment.html' },
];

const FOOTER_COLUMNS = [
  {
    key: 'nav.product',
    title: '产品与服务',
    links: [
      ['menu.product.1', '产品总览', '/#sec-what'],
      ['menu.product.2', '四种经营模式', '/#mode-explorer'],
      ['svc.deploy.title', '私有化部署', '/#service-deploy'],
      ['svc.security.title', '数据安全', '/#service-security'],
    ],
  },
  {
    key: 'footer.industry.cases',
    title: '行业与案例',
    links: [
      ['menu.solution.1', '家电与电工', '/#industrySolutions'],
      ['menu.solution.2', '电子元器件', '/#industrySolutions'],
      ['menu.solution.3', '工业制造', '/#industrySolutions'],
      ['menu.solution.4', '快消与零售', '/#industrySolutions'],
      ['nav.cases', '客户案例', '/#caseStudies'],
    ],
  },
  {
    key: 'nav.ai',
    title: 'AI 智能体',
    links: [
      ['footer.ai.overview', 'AI 智能体总览', '/#aiAgent'],
      ['ag.scene.1', '客服场景', '/#aiAgent'],
      ['ag.scene.2', '询报价场景', '/#aiAgent'],
      ['ag.scene.3', '工单场景', '/#aiAgent'],
    ],
  },
  {
    key: 'nav.tech',
    title: 'Technology',
    links: TECH_PAGES.map((page) => [page.key, page.label, page.href]),
  },
  {
    key: 'footer.about',
    title: '关于与支持',
    links: [
      ['menu.about.company', '公司介绍', '/#sec-about'],
      ['footer.address', '地址与联系', '/#journeyBox'],
      ['menu.about.certifications', '安全认证', '/#certRow'],
      ['how.qa', 'Q&A · 常见问题', '/#sec-faq'],
    ],
  },
];

const headerMarkup = () => `
  <a class="site-skip-link" href="#main-content" data-i18n="nav.skip">跳到主要内容</a>
  <header class="site-header" id="siteHeader">
    <div class="site-header-inner">
      <a class="site-brand" href="/" aria-label="ShopeX">
        <img src="/assets/logo-shopex.png" alt="ShopeX"
          onerror="this.outerHTML='&lt;span class=&quot;site-brand-fallback&quot;&gt;ShopeX&lt;/span&gt;'">
      </a>
      <nav class="site-desktop-nav" aria-label="Navigation" data-i18n-aria="nav.menu">
        ${SITE_NAV.map((item) => `
          <a class="site-nav-link${item.active ? ' is-active' : ''}" href="${item.href}"
            ${item.active ? 'aria-current="page"' : ''} data-i18n="${item.key}">${item.label}</a>`).join('')}
      </nav>
      <div class="site-header-actions">
        <button class="site-login-link" type="button" data-i18n="nav.login">登录</button>
        <button class="site-primary-button" type="button" data-tech-cta aria-label="获取方案" data-i18n-aria="cta.get">
          <span class="site-cta-label" data-i18n="cta.get">获取方案</span><span class="site-cta-short" data-i18n="cta.short">获取方案</span>
        </button>
        <button class="site-mobile-toggle" id="m-nav" type="button"
          aria-label="导航菜单" aria-expanded="false" aria-controls="mobileNav" data-i18n-aria="nav.menu">
          <svg class="site-icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg class="site-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </div>
    <nav class="site-mobile-nav" id="mobileNav" aria-label="Navigation" data-i18n-aria="nav.menu" hidden>
      <div class="site-mobile-nav-inner">
        <details class="site-mobile-group">
          <summary><span data-i18n="nav.tech">Technology</span><svg class="site-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary>
          <div class="site-mobile-sublinks">
            ${TECH_PAGES.map((page) => `
              <a href="${page.href}" data-tech-nav="${page.id}" data-i18n="${page.key}">${page.label}</a>`).join('')}
          </div>
        </details>
        ${SITE_NAV.filter((item) => !item.active).map((item) => `
          <a class="site-mobile-link" href="${item.href}" data-i18n="${item.key}">${item.label}</a>`).join('')}
      </div>
    </nav>
  </header>`;

const footerMarkup = () => `
  <footer id="siteFooter" class="site-footer">
    <div class="site-footer-grid">
      <div class="site-footer-brand">
        <a class="site-brand" href="/" aria-label="ShopeX">
          <img src="/assets/logo-shopex.png" alt="ShopeX"
            onerror="this.outerHTML='&lt;span class=&quot;site-brand-fallback&quot;&gt;ShopeX&lt;/span&gt;'">
        </a>
        <p data-i18n="footer.slogan">让渠道、数据与 AI 在同一套 B2B 底座上协同流动。</p>
      </div>
      <nav class="site-footer-links" aria-label="Navigation" data-i18n-aria="nav.menu">
        ${FOOTER_COLUMNS.map((column) => `
          <section class="site-footer-column">
            <h2 class="site-footer-title" data-i18n="${column.key}">${column.title}</h2>
            ${column.links.map(([key, label, href]) => `<a href="${href}" data-i18n="${key}">${label}</a>`).join('')}
          </section>`).join('')}
      </nav>
    </div>
    <div class="site-footer-bottom">
      <span data-i18n="footer.copy">© 2025 ShopeX</span>
      <span data-i18n="footer.links">隐私政策 | 服务条款 | 网站地图</span>
    </div>
  </footer>`;

const sectionNavMarkup = (current) => `
  <div class="tp-subnav">
    <div class="tp-subnav-inner" role="navigation" aria-label="Technology sections">
      ${TECH_PAGES.map((page) => `
        <a class="tp-subnav-link${page.id === current ? ' on' : ''}" href="${page.href}"
          ${page.id === current ? 'aria-current="page"' : ''} data-i18n="${page.key}">${page.label}</a>`).join('')}
    </div>
  </div>`;

export function mountChrome(currentTechPage = 'architecture') {
  const headerHost = document.getElementById('site-header');
  const footerHost = document.getElementById('site-footer');
  const subnavHost = document.getElementById('tech-subnav');
  if (headerHost) headerHost.innerHTML = headerMarkup();
  if (footerHost) footerHost.innerHTML = footerMarkup();
  if (subnavHost) subnavHost.innerHTML = sectionNavMarkup(currentTechPage);

  bindMobileNav();
  bindCta();
}

function bindMobileNav() {
  const toggle = document.getElementById('m-nav');
  const panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      toggle.focus({ preventScroll: true });
    }
  });
}

/* 统一 CTA 出口：当前阶段回主页面报价流程，并带上来源标记便于归因 */
function bindCta() {
  document.querySelectorAll('[data-tech-cta]').forEach((button) => {
    button.addEventListener('click', () => {
      const from = document.documentElement.dataset.techPage || 'architecture';
      window.location.href = `/?lead=${encodeURIComponent(`tech-${from}`)}#what-pricing`;
    });
  });
}
