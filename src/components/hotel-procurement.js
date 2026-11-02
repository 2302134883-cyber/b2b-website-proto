/* ============ 酒店集采子页面交互 ============
 * 1) 痛点自检：点击勾选 → 计数与判定话术，≥3 条露出「看看系统怎么解」
 * 2) ROI 计算器：酒店数 / 月采购额 / 采购人数 → 释放人力、溢价节省、年合计
 * 3) data-hp-scroll：平滑滚动到锚点（尊重 reduced-motion）
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = (key, fallback) => {
    const v = window.__i18nT?.(key);
    return v != null ? v : fallback;
  };

  /* ---- 痛点自检 ---- */
  const painCards = [...document.querySelectorAll('.hp-pain-card')];
  const painCount = document.getElementById('hpPainCount');
  const painVerdict = document.getElementById('hpPainVerdict');
  const painCta = document.getElementById('hpPainCta');

  function renderPain() {
    if (!painCount || !painVerdict) return;
    const n = painCards.filter((c) => c.classList.contains('on')).length;
    painCount.textContent = String(n);
    const key = n === 0 ? 'hp.pain.verdict.0' : n <= 2 ? 'hp.pain.verdict.some' : 'hp.pain.verdict.many';
    painVerdict.textContent = t(key, '');
    painCta?.classList.toggle('show', n >= 3);
  }
  painCards.forEach((card) => {
    card.addEventListener('click', () => {
      const on = card.classList.toggle('on');
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
      renderPain();
    });
  });

  /* ---- ROI 计算器 ---- */
  const inHotels = document.getElementById('hpRoiHotels');
  const inGmv = document.getElementById('hpRoiGmv');
  const inStaff = document.getElementById('hpRoiStaff');
  const out = {
    hotels: document.getElementById('hpRoiHotelsVal'),
    gmv: document.getElementById('hpRoiGmvVal'),
    staff: document.getElementById('hpRoiStaffVal'),
    labor: document.getElementById('hpRoiLabor'),
    premium: document.getElementById('hpRoiPremium'),
    total: document.getElementById('hpRoiTotal'),
  };
  const fmt = (n) => n.toLocaleString(document.documentElement.lang || 'zh-CN');

  function renderRoi() {
    if (!inHotels || !inGmv || !inStaff) return;
    const hotels = Number(inHotels.value);
    const gmv = Number(inGmv.value); // 万元/月
    const staff = Number(inStaff.value);
    if (out.hotels) out.hotels.textContent = fmt(hotels);
    if (out.gmv) out.gmv.textContent = fmt(gmv);
    if (out.staff) out.staff.textContent = fmt(staff);

    const freed = Math.max(1, Math.round(staff * 0.6));        // 释放人力（人）
    const premium = Math.round(gmv * 12 * 0.02);                // 急单溢价节省（万元/年）
    const laborSave = freed * 12;                               // 人力成本节省（万元/年，按 12 万/人·年）
    const total = laborSave + premium;
    if (out.labor) out.labor.textContent = fmt(freed);
    if (out.premium) out.premium.textContent = fmt(premium);
    if (out.total) out.total.textContent = fmt(total);
  }
  [inHotels, inGmv, inStaff].forEach((el) => el?.addEventListener('input', renderRoi));

  /* ---- 平滑滚动 ---- */
  document.querySelectorAll('[data-hp-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-hp-scroll'));
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---- 案例数字：滚动进入视口后递增动画 ---- */
  const statNums = [...document.querySelectorAll('.hp-stat-num [data-count]')];
  function animateNum(el) {
    const target = Number(el.getAttribute('data-count'));
    if (reduced) { el.textContent = String(target); return; }
    const t0 = performance.now(); const dur = 900;
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (statNums.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animateNum(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    statNums.forEach((el) => io.observe(el));
  }

  document.addEventListener('i18n:applied', () => { renderPain(); renderRoi(); });
  renderPain();
  renderRoi();
})();
