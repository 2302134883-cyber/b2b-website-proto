const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/i18n-uBwl9M1u.js","assets/rolldown-runtime-XKyaHtl9.js"])))=>i.map(i=>d[i]);
import"./section-tones-B6wW9CL1.js";import{t as e}from"./preload-helper-C-zyIwqN.js";var t=[{key:`nav.product`,label:`产品与服务`,href:`/#sec-what`},{key:`nav.solution`,label:`行业方案`,href:`/#industrySolutions`},{key:`nav.cases`,label:`客户案例`,href:`/#caseStudies`},{key:`nav.ai`,label:`AI 智能体`,href:`/#aiAgent`},{key:`nav.tech`,label:`Technology`,href:`/tech/`,active:!0},{key:`nav.about`,label:`关于我们`,href:`/#sec-about`}],n=[{id:`architecture`,key:`nav.tech.arch`,label:`架构与技术栈`,href:`/tech/`},{id:`reliability`,key:`nav.tech.rel`,label:`可靠性与可观测性`,href:`/tech/reliability.html`},{id:`security`,key:`nav.tech.sec`,label:`安全与合规`,href:`/tech/security.html`},{id:`deployment`,key:`nav.tech.ops`,label:`部署与运维`,href:`/tech/deployment.html`}],r=[{key:`nav.product`,title:`产品与服务`,links:[[`menu.product.1`,`产品总览`,`/#sec-what`],[`menu.product.2`,`四种经营模式`,`/#mode-explorer`],[`svc.deploy.title`,`私有化部署`,`/#service-deploy`],[`svc.security.title`,`数据安全`,`/#service-security`]]},{key:`footer.industry.cases`,title:`行业与案例`,links:[[`menu.solution.1`,`家电与电工`,`/#industrySolutions`],[`menu.solution.2`,`电子元器件`,`/#industrySolutions`],[`menu.solution.3`,`工业制造`,`/#industrySolutions`],[`menu.solution.4`,`快消与零售`,`/#industrySolutions`],[`nav.cases`,`客户案例`,`/#caseStudies`]]},{key:`nav.ai`,title:`AI 智能体`,links:[[`footer.ai.overview`,`AI 智能体总览`,`/#aiAgent`],[`ag.scene.1`,`客服场景`,`/#aiAgent`],[`ag.scene.2`,`询报价场景`,`/#aiAgent`],[`ag.scene.3`,`工单场景`,`/#aiAgent`]]},{key:`nav.tech`,title:`Technology`,links:n.map(e=>[e.key,e.label,e.href])},{key:`footer.about`,title:`关于与支持`,links:[[`menu.about.company`,`公司介绍`,`/#sec-about`],[`footer.address`,`地址与联系`,`/#journeyBox`],[`menu.about.certifications`,`安全认证`,`/#certRow`],[`how.qa`,`Q&A · 常见问题`,`/#sec-faq`]]}],i=()=>`
  <a class="site-skip-link" href="#main-content" data-i18n="nav.skip">跳到主要内容</a>
  <header class="site-header" id="siteHeader">
    <div class="site-header-inner">
      <a class="site-brand" href="/" aria-label="ShopeX">
        <img src="/assets/logo-shopex.png" alt="ShopeX"
          onerror="this.outerHTML='&lt;span class=&quot;site-brand-fallback&quot;&gt;ShopeX&lt;/span&gt;'">
      </a>
      <nav class="site-desktop-nav" aria-label="Navigation" data-i18n-aria="nav.menu">
        ${t.map(e=>`
          <a class="site-nav-link${e.active?` is-active`:``}" href="${e.href}"
            ${e.active?`aria-current="page"`:``} data-i18n="${e.key}">${e.label}</a>`).join(``)}
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
            ${n.map(e=>`
              <a href="${e.href}" data-tech-nav="${e.id}" data-i18n="${e.key}">${e.label}</a>`).join(``)}
          </div>
        </details>
        ${t.filter(e=>!e.active).map(e=>`
          <a class="site-mobile-link" href="${e.href}" data-i18n="${e.key}">${e.label}</a>`).join(``)}
      </div>
    </nav>
  </header>`,a=()=>`
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
        ${r.map(e=>`
          <section class="site-footer-column">
            <h2 class="site-footer-title" data-i18n="${e.key}">${e.title}</h2>
            ${e.links.map(([e,t,n])=>`<a href="${n}" data-i18n="${e}">${t}</a>`).join(``)}
          </section>`).join(``)}
      </nav>
    </div>
    <div class="site-footer-bottom">
      <span data-i18n="footer.copy">© 2025 ShopeX</span>
      <span data-i18n="footer.links">隐私政策 | 服务条款 | 网站地图</span>
    </div>
  </footer>`,o=e=>`
  <div class="tp-subnav">
    <div class="tp-subnav-inner" role="navigation" aria-label="Technology sections">
      ${n.map(t=>`
        <a class="tp-subnav-link${t.id===e?` on`:``}" href="${t.href}"
          ${t.id===e?`aria-current="page"`:``} data-i18n="${t.key}">${t.label}</a>`).join(``)}
    </div>
  </div>`;function s(e=`architecture`){let t=document.getElementById(`site-header`),n=document.getElementById(`site-footer`),r=document.getElementById(`tech-subnav`);t&&(t.innerHTML=i()),n&&(n.innerHTML=a()),r&&(r.innerHTML=o(e)),c(),l()}function c(){let e=document.getElementById(`m-nav`),t=document.getElementById(`mobileNav`);if(!e||!t)return;let n=n=>{t.hidden=!n,e.setAttribute(`aria-expanded`,String(n)),e.classList.toggle(`is-open`,n)};e.addEventListener(`click`,()=>n(t.hidden)),document.addEventListener(`keydown`,r=>{r.key===`Escape`&&!t.hidden&&(n(!1),e.focus({preventScroll:!0}))})}function l(){document.querySelectorAll(`[data-tech-cta]`).forEach(e=>{e.addEventListener(`click`,()=>{let e=document.documentElement.dataset.techPage||`architecture`;window.location.href=`/?lead=${encodeURIComponent(`tech-${e}`)}#what-pricing`})})}var u=document.documentElement.dataset.techPage||`architecture`;s(u),e(()=>import(`./i18n-uBwl9M1u.js`).then(e=>e.t).then(()=>{document.dispatchEvent(new CustomEvent(`tech:chrome-ready`,{detail:{page:u}}))}),__vite__mapDeps([0,1]));var d=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;(function(){let e=document.querySelectorAll(`.tp-reveal`);if(!e.length)return;if(d||!(`IntersectionObserver`in window)){e.forEach(e=>e.classList.add(`in`));return}let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`in`),t.unobserve(e.target))})},{threshold:.18,rootMargin:`0px 0px -8% 0px`});e.forEach(e=>t.observe(e))})(),(function(){let e=document.querySelector(`.tp-stats`);if(!e)return;let t=[...e.querySelectorAll(`.tp-stat b[data-value]`)],n=e=>e>=1e3?e.toLocaleString(`en-US`):String(e),r=()=>{t.forEach((e,t)=>{let r=parseInt(e.getAttribute(`data-value`),10)||0;if(d){e.textContent=n(r);return}e.textContent=`0`;let i=performance.now()+t*120;(function t(a){let o=Math.min(Math.max((a-i)/900,0),1);e.textContent=n(Math.round(r*(1-(1-o)**3))),o<1&&requestAnimationFrame(t)})(performance.now())})};d||!(`IntersectionObserver`in window)?r():new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&r()})},{threshold:.4}).observe(e)})(),(function(){let e=document.querySelector(`.tp-msflow`);if(!e)return;let t=[...e.querySelectorAll(`.tp-msflow-row`)];if(!t.length)return;let n=e=>t.forEach(t=>t.classList.toggle(`is-open`,t===e));t.forEach(e=>{e.addEventListener(`mouseenter`,()=>n(e)),e.addEventListener(`click`,()=>n(e)),e.addEventListener(`focusin`,()=>n(e))})})(),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[href^="#"]`);if(!t)return;let n=t.getAttribute(`href`).slice(1);if(!n)return;let r=document.getElementById(n);r&&(e.preventDefault(),r.scrollIntoView({behavior:d?`auto`:`smooth`,block:`start`}),history.replaceState(null,``,`#${n}`))});