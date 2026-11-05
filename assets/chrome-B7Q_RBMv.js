import{t as e}from"./site-header-6sxXsUEY.js";var t=`/b2b-website-proto/`.replace(/\/+$/,``),n=[{id:`architecture`,key:`nav.tech.arch`,label:`架构与技术栈`,href:`/tech/`},{id:`security`,key:`nav.tech.sec`,label:`安全与合规`,href:`/tech/security.html`},{id:`reliability`,key:`nav.tech.rel`,label:`可靠性与可观测性`,href:`/tech/reliability.html`},{id:`deployment`,key:`nav.tech.ops`,label:`部署与运维`,href:`/tech/deployment.html`}],r=[{id:`supply`,key:`pp.nav.supply`,label:`商品与供给`,href:`/product/supply.html`,short:`标准商品库、发布审核、类目品牌与店铺装修`},{id:`pricing`,key:`pp.nav.pricing`,label:`定价与交易`,href:`/product/pricing.html`,short:`协议价解析、购物车结算与批量下单`},{id:`fulfillment`,key:`pp.nav.fulfillment`,label:`库存与履约`,href:`/product/fulfillment.html`,short:`多仓库存、寻仓发运与订单售后闭环`},{id:`finance`,key:`pp.nav.finance`,label:`资金与财务`,href:`/product/finance.html`,short:`预存授信、应收实收与开票红冲`},{id:`customer`,key:`pp.nav.customer`,label:`客户与渠道`,href:`/product/customer.html`,short:`客户分层、企业采购管控与分销激励`},{id:`marketing`,key:`pp.nav.marketing`,label:`营销与增长`,href:`/product/marketing.html`,short:`促销与券、返利与活动触达`},{id:`compliance`,key:`pp.nav.compliance`,label:`合规与准入`,href:`/product/compliance.html`,short:`资质证照、准入校验与效期预警`}],i=[{key:`nav.product`,title:`产品`,links:[[`menu.product.1`,`B2B（DMS）产品总览`,null],[`menu.product.features`,`产品功能`,`/product/supply.html`]]},{key:`nav.solution`,title:`解决方案`,links:[[`menu.solution.ind`,`行业解决方案`,null],[`menu.solution.gen`,`通用解决方案`,null],[`nav.cases`,`客户案例`,`/cases/`]]},{key:`nav.ai`,title:`AI智能应用`,links:[[`menu.ai.1`,`AI采购助手`,`/ai-agent/index.html#procurement`],[`menu.ai.2`,`AI定制应用`,`/ai-agent/index.html#custom`],[`menu.ai.3`,`Workbuddy`,`/ai-agent/index.html#workbuddy`]]},{key:`nav.insight`,title:`洞察`,links:[[`menu.insight.1`,`行业白皮书`,null],[`menu.insight.2`,`行业资讯`,null],[`menu.insight.3`,`博客`,null]]},{key:`nav.tech`,title:`技术架构`,links:[[`nav.tech.arch`,`架构与技术栈`,`/tech/`]]},{key:`nav.about`,title:`关于商派`,links:[[`menu.about.profile`,`公司简介`,null],[`menu.about.culture`,`公司文化`,null],[`menu.about.brands`,`品牌客户`,null],[`menu.about.csr`,`社会责任`,null]]}],a=e=>e?`href="${e}"`:`data-page-pending`,o=()=>e(`/`),s=()=>`
  <footer id="siteFooter" class="site-footer">
    <div class="site-footer-grid">
      <div class="site-footer-brand">
        <a class="site-brand" href="/" aria-label="ShopeX">
          <img src="${t}/assets/logo-shopex.png" alt="ShopeX"
            onerror="this.outerHTML='&lt;span class=&quot;site-brand-fallback&quot;&gt;ShopeX&lt;/span&gt;'">
        </a>
        <p data-i18n="footer.slogan">让渠道、数据与 AI 在同一套 B2B 底座上协同流动。</p>
      </div>
      <nav class="site-footer-links" aria-label="Navigation" data-i18n-aria="nav.menu">
        ${i.map(e=>`
          <section class="site-footer-column">
            <h2 class="site-footer-title" data-i18n="${e.key}">${e.title}</h2>
            ${e.links.map(([e,t,n])=>`<a ${a(n)} data-i18n="${e}">${t}</a>`).join(``)}
          </section>`).join(``)}
      </nav>
    </div>
    <div class="site-footer-bottom">
      <span data-i18n="footer.copy">© 2025 ShopeX</span>
      <span data-i18n="footer.links">隐私政策 | 服务条款 | 网站地图</span>
    </div>
  </footer>`,c=e=>`
  <div class="tp-subnav">
    <div class="tp-subnav-inner" role="navigation" aria-label="Technology sections">
      ${n.map(t=>`
        <a class="tp-subnav-link${t.id===e?` on`:``}" href="${t.href}"
          ${t.id===e?`aria-current="page"`:``} data-i18n="${t.key}">${t.label}</a>`).join(``)}
    </div>
  </div>`,l=e=>r.filter(t=>t.id!==e).map(e=>`
        <a class="tp-entry" href="${e.href}">
          <span class="tp-entry-top"><strong data-i18n="${e.key}">${e.label}</strong>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <p data-i18n="pp.tile.${e.id}.d">${e.short}</p>
        </a>`).join(``),u=e=>`
  <div class="tp-subnav">
    <div class="tp-subnav-inner" role="navigation" aria-label="Product capabilities">
      ${r.map(t=>t.href?`<a class="tp-subnav-link${t.id===e?` on`:``}" href="${t.href}"
          ${t.id===e?`aria-current="page"`:``} data-i18n="${t.key}">${t.label}</a>`:`<span class="tp-subnav-link tp-subnav-link--pending" data-i18n="${t.key}">${t.label}</span>`).join(``)}
    </div>
  </div>`;function d(e=`architecture`){let t=document.getElementById(`site-header`),n=document.getElementById(`site-footer`),r=document.getElementById(`tech-subnav`);t&&(t.innerHTML=o()),n&&(n.innerHTML=s()),r&&(r.innerHTML=c(e)),p(),m()}function f(e=`supply`){d();let t=document.getElementById(`product-subnav`);t&&(t.innerHTML=u(e));let n=document.querySelector(`[data-product-more]`);n&&(n.innerHTML=l(e))}function p(){let e=document.getElementById(`m-nav`),t=document.getElementById(`mobileNav`);if(!e||!t)return;let n=n=>{t.hidden=!n,e.setAttribute(`aria-expanded`,String(n)),e.classList.toggle(`is-open`,n)};e.addEventListener(`click`,()=>n(t.hidden)),document.addEventListener(`keydown`,r=>{r.key===`Escape`&&!t.hidden&&(n(!1),e.focus({preventScroll:!0}))})}function m(){document.querySelectorAll(`[data-tech-cta]`).forEach(e=>{e.addEventListener(`click`,()=>{let e=document.documentElement.dataset.techPage||`architecture`;window.location.href=`/?lead=${encodeURIComponent(`tech-${e}`)}`})})}export{f as n,d as t};