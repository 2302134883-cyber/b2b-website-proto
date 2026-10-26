(function () {
  /* 业务术语与旅程文案为演示占位（中文），正式内容确认后再入 i18n 词典 */
  const N = {
    u_retail:'零售客户', u_channel:'渠道商', u_agent:'代理商', u_vip:'VIP 客户', u_store:'传统门店', u_ent:'企业大客', u_sales:'业务员', u_ops:'运营 / 管理',
    t_pc:'PC', t_mini:'小程序', t_h5:'H5', t_app:'APP', t_wx:'企微', t_dd:'钉钉', t_api:'Open API',
    s_order:'订货场景', s_trade:'交易 / 折让', s_fund:'资金 / 结算', s_after:'售后 / 服务', s_org:'组织 / 成员', s_pre:'业务员 · 售前', s_mid:'业务员 · 售中', s_post:'业务员 · 售后',
    c_order:'订单中心', c_price:'价格中心', c_pay:'支付中心', c_settle:'结算中心',
    c_stock:'库存中心', c_logi:'物流中心', c_goods:'商品中心',
    c_cust:'客户中心', c_mkt:'营销中心', c_svc:'售后中心', c_cms:'内容中心', c_group:'集团中心',
    e_erp:'ERP', e_wms:'WMS', e_tms:'TMS', e_crm:'CRM', e_oa:'OA', e_pos:'POS', e_srm:'SRM', e_drp:'DRP',
  };
  const LAYERS = [
    { i18n:'arch.l1', name:'用户层',     nodes:['u_retail','u_channel','u_agent','u_vip','u_store','u_ent','u_sales','u_ops'] },
    { i18n:'arch.l2', name:'触点层',     nodes:['t_pc','t_mini','t_h5','t_app','t_wx','t_dd','t_api'] },
    { i18n:'arch.l3', name:'业务场景层', nodes:['s_order','s_trade','s_fund','s_after','s_org','s_pre','s_mid','s_post'] },
    { i18n:'arch.l4', name:'中台能力层', groups:[
      { name:'交易域',     nodes:['c_order','c_price','c_pay','c_settle'] },
      { name:'履约域',     nodes:['c_stock','c_logi'] },
      { name:'商品域',     nodes:['c_goods'] },
      { name:'客户运营域', nodes:['c_cust','c_mkt','c_svc','c_cms'] },
      { name:'组织域',     nodes:['c_group'] },
    ]},
    { i18n:'arch.l5', name:'后台系统层', nodes:['e_erp','e_wms','e_tms','e_crm','e_oa','e_pos','e_srm','e_drp'] },
  ];
  const ROLES = [
    {
      id:'customer', name:'企业客户', tag:'想省心补货的采购方',
      centers:7, touch:4, scenes:5,
      journey:['开户审核','选品 / 批量订货','授信 / 支付','收货','售后 · 对账'],
      chain:'小程序 / APP → 订货 · 交易 · 资金场景 → 中台（商品 · 价格 · 库存 · 订单 · 支付 · 结算）→ ERP / WMS',
      note:'核心是「价格中心」的一客一价与「支付中心」的授信额度。',
      on:['u_retail','u_channel','u_agent','u_vip','u_store','u_ent',
          't_pc','t_mini','t_h5','t_app',
          's_order','s_trade','s_fund','s_after','s_org',
          'c_goods','c_price','c_stock','c_order','c_pay','c_settle','c_logi',
          'e_erp','e_wms'],
    },
    {
      id:'sales', name:'业务员', tag:'背业绩指标的一线销售',
      centers:6, touch:3, scenes:4,
      journey:['线索收集','客户分配','代客下单','折扣 / 订单审批','应收跟进','业绩统计'],
      chain:'企微 / 钉钉 → 售前 · 售中 · 售后工作台 → 中台（客户 · 营销 · 订单 · 价格 · 结算 · 售后）→ CRM / ERP',
      note:'核心是「客户中心」的客户池与「订单中心」的代客下单。',
      on:['u_sales','t_wx','t_dd','t_pc',
          's_pre','s_mid','s_post','s_org',
          'c_cust','c_mkt','c_order','c_price','c_settle','c_svc',
          'e_crm','e_erp'],
    },
    {
      id:'ops', name:'运营 · 管理', tag:'中台的操盘手',
      centers:13, touch:7, scenes:8,
      journey:['商品上架','价格策略','营销活动','订单 / 售后审核','数据复盘'],
      chain:'PC 运营后台 → 管理场景 → 全部 13 个中台中心 → ERP / WMS / TMS / CRM 全量集成',
      note:'唯一触及所有中心与后台系统的角色——「中台运营中心」因此得名。',
      on:'ALL',
    },
  ];
  const GLYPHS = {
    customer:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
    sales:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8"/><path d="M4 13.5h16"/></svg>',
    ops:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10"/><path d="M18 7h2"/><circle cx="16" cy="7" r="2"/><path d="M4 12h4"/><path d="M12 12h8"/><circle cx="10" cy="12" r="2"/><path d="M4 17h9"/><path d="M17 17h3"/><circle cx="15" cy="17" r="2"/></svg>',
  };

  const $ = (id) => document.getElementById(id);
  const selectEl = $('archSelect'), viewEl = $('archView');
  const cards = $('archCards'), tabs = $('archTabs'), board = $('archBoard'), panel = $('archPanel');
  const enterBtn = $('archEnter'), enterLabel = $('archEnterLabel');
  if (!selectEl || !viewEl || !cards || !tabs || !board || !panel || !enterBtn || !enterLabel) return;

  const chip = (id) => `<span class="arch-node" data-n="${id}">${N[id]}</span>`;
  const stat = (key, label, v, max) =>
    `<span class="arch-stat"><span data-i18n="${key}">${label}</span><span class="bar"><i style="transform:scaleX(${(v / max).toFixed(2)})"></i></span><span class="val">${v}/${max}</span></span>`;

  /* 一次性渲染全部内容（含三个角色面板），之后只做 class / hidden 切换——语言切换由 i18n.js 全量 apply 覆盖 */
  cards.innerHTML = ROLES.map((r) => `
    <label class="arch-role" data-role="${r.id}">
      <input class="arch-role-input" type="radio" name="arch-role" value="${r.id}" data-i18n-aria="role.${r.id}.name" aria-label="${r.name}">
      <span class="arch-radio" aria-hidden="true"></span>
      <span class="arch-who">
        <span class="arch-ava">
          <svg class="orb orb-slow" viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="url(#orbNode)"/></svg>
          <span class="arch-gly" aria-hidden="true">${GLYPHS[r.id]}</span>
        </span>
        <span>
          <span class="arch-rname" data-i18n="role.${r.id}.name">${r.name}</span>
          <span class="arch-rtag" data-i18n="role.${r.id}.tag">${r.tag}</span>
        </span>
      </span>
      <span class="arch-stats">
        ${stat('arch.stat.centers', '中台中心', r.centers, 13)}
        ${stat('arch.stat.touch', '触点', r.touch, 7)}
        ${stat('arch.stat.scene', '场景', r.scenes, 8)}
      </span>
    </label>`).join('');

  tabs.innerHTML = ROLES.map((r) =>
    `<button class="arch-tab" type="button" data-role="${r.id}" aria-pressed="false"><span data-i18n="role.${r.id}.name">${r.name}</span></button>`).join('');

  board.insertAdjacentHTML('beforeend', LAYERS.map((l) => `
    <div class="arch-layer">
      <span class="arch-lname" data-i18n="${l.i18n}">${l.name}</span>
      <div class="arch-nodes">${l.groups
        ? l.groups.map((g) => `<span class="arch-grp"><span class="arch-gname">${g.name}</span>${g.nodes.map(chip).join('')}</span>`).join('')
        : l.nodes.map(chip).join('')}</div>
    </div>`).join(''));

  panel.innerHTML = ROLES.map((r) => `
    <div class="arch-pane" data-pane="${r.id}" hidden>
      <span class="arch-rname" data-i18n="role.${r.id}.name">${r.name}</span>
      <p class="arch-rtag" data-i18n="role.${r.id}.tag">${r.tag}</p>
      <p class="arch-plabel" data-i18n="arch.journey">角色旅程</p>
      <div class="arch-journey">${r.journey.map((s, i, a) =>
        `<span class="stp">${s}</span>${i < a.length - 1 ? '<span class="arr">→</span>' : ''}`).join('')}</div>
      <p class="arch-plabel" data-i18n="arch.chain">点亮的链路</p>
      <p class="arch-chain">${r.chain}</p>
      <p class="arch-chain">${r.note}</p>
    </div>`).join('');

  const nodes = board.querySelectorAll('.arch-node');
  const tabEls = [...tabs.querySelectorAll('.arch-tab')];
  const panes = [...panel.querySelectorAll('.arch-pane')];
  const roleInputs = [...cards.querySelectorAll('.arch-role-input')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selectedRole = null, switching = false;

  function tr(key, fallback) {
    return (window.__i18nT && window.__i18nT(key)) || fallback;
  }

  function updateEnter() {
    enterBtn.disabled = !selectedRole;
    if (!selectedRole) {
      enterLabel.textContent = tr('arch.enter.empty', '请先选择角色');
      return;
    }
    const role = ROLES.find((r) => r.id === selectedRole);
    const roleName = tr('role.' + selectedRole + '.name', role.name);
    enterLabel.textContent = tr('arch.enter', '以「{role}」视角进入').replace('{role}', roleName);
  }

  function choose(id) {
    if (!ROLES.some((r) => r.id === id)) return;
    selectedRole = id;
    updateEnter();
  }

  updateEnter();
  document.addEventListener('i18n:applied', updateEnter);

  function pick(id, fromCards) {
    const role = ROLES.find((r) => r.id === id);
    if (!role) return;
    tabEls.forEach((t) => {
      const on = t.dataset.role === id;
      t.classList.toggle('on', on);
      t.setAttribute('aria-pressed', String(on));
    });
    panes.forEach((p) => { p.hidden = p.dataset.pane !== id; });
    const all = role.on === 'ALL';
    const set = all ? null : new Set(role.on);
    viewEl.classList.add('picked');
    nodes.forEach((n) => n.classList.toggle('on', all || set.has(n.dataset.n)));
    if (fromCards && !selectEl.hidden && !switching) {
      switching = true;
      selectEl.classList.add('bye');
      setTimeout(() => {           /* 语义状态立即落定，延时只做 display 收尾 */
        selectEl.hidden = true;
        viewEl.hidden = false;
        viewEl.classList.add('hi');
        switching = false;
        const activeTab = tabEls.find((t) => t.dataset.role === id);
        if (activeTab) activeTab.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 240);
    }
  }

  cards.addEventListener('change', (e) => {
    if (e.target.matches('.arch-role-input')) choose(e.target.value);
  });
  enterBtn.addEventListener('click', () => {
    if (selectedRole) pick(selectedRole, true);
  });
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.arch-tab');
    if (btn) pick(btn.dataset.role, false);
  });
  $('archBack').addEventListener('click', () => {
    viewEl.hidden = true;
    viewEl.classList.remove('hi', 'picked');
    nodes.forEach((n) => n.classList.remove('on'));
    selectEl.hidden = false;
    requestAnimationFrame(() => {
      selectEl.classList.remove('bye');
      const selected = roleInputs.find((input) => input.value === selectedRole);
      if (selected) selected.focus({ preventScroll: true });
    });
  });

  /* 入视自动演示一遍：选「企业客户」进入 → 依次点亮业务员 / 运营 → 回到企业客户（用户点击/按键即让位） */
  let demoToken = 0;
  const archRoot = selectEl.closest('section') || selectEl.parentElement;
  function autoDemo() {
    if (selectedRole || !viewEl.hidden) return;   // 用户已经玩过
    const my = ++demoToken;
    const seq = [
      () => {
        const input = roleInputs.find((i) => i.value === 'customer');
        if (input) input.checked = true;
        choose('customer');
      },
      () => { enterBtn.click(); },
      () => { pick('sales', false); },
      () => { pick('ops', false); },
      () => { pick('customer', false); },
    ];
    let i = 0;
    (function next() {
      if (my !== demoToken || i >= seq.length) return;
      seq[i++]();
      setTimeout(next, i === 1 ? 900 : 2400);   // 选中后稍快进入，之后每个角色停留 2.4s
    })();
  }
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    setTimeout(autoDemo, 500);
  }, { threshold: 0.35 }).observe(archRoot);
  archRoot.addEventListener('pointerdown', () => { demoToken++; }, { capture: true });
  archRoot.addEventListener('keydown', () => { demoToken++; }, true);
})();
