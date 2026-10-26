(function () {
  const dlg = document.getElementById('leadDialog');
  if (!dlg) return;
  const formEl = document.getElementById('leadForm');
  const doneEl = document.getElementById('leadDone');
  const actForm = document.getElementById('leadActions');
  const actDone = document.getElementById('leadDoneActions');
  const emailEl = document.getElementById('leadEmail');
  const errEl = document.getElementById('leadEmailErr');
  let leadIndustry = '';

  function showForm() {
    formEl.style.display = ''; doneEl.style.display = 'none';
    actForm.style.display = ''; actDone.style.display = 'none';
    errEl.style.display = 'none';
    emailEl.error = false;
  }
  function submit() {
    const v = emailEl.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    emailEl.error = !ok;
    errEl.style.display = ok ? 'none' : 'block';
    if (!ok) return;
    // 原型阶段：打印完整需求单（接入时换成真实提交到客服/CRM）
    console.log('[lead]', {
      mode: window.__selectedBusinessMode || null,
      services: [...document.querySelectorAll('#q-services md-filter-chip')].filter((c) => c.selected).map((c) => c.getAttribute('data-i18n-label')),
      industry: leadIndustry || document.getElementById('q-industry').value,
      size: document.getElementById('q-size').value,
      email: v,
    });
    formEl.style.display = 'none'; doneEl.style.display = '';
    actForm.style.display = 'none'; actDone.style.display = '';
  }
  function openLead(industry, mode) {
    leadIndustry = industry || '';
    window.__selectedBusinessMode = mode || null;
    showForm();
    dlg.show();
    requestAnimationFrame(() => emailEl.focus({ preventScroll: true }));
  }
  window.__openLeadDialog = function (mode) {
    openLead('', mode);
  };

  document.querySelectorAll('[data-lead-open]').forEach((button) => {

    button.addEventListener('click', () => openLead());
  });
  document.getElementById('cta-plan').addEventListener('click', () => openLead());
  document.querySelectorAll('[data-lead-industry]').forEach((button) => {
    button.addEventListener('click', () => openLead(button.getAttribute('data-lead-industry')));
  });
  document.getElementById('leadCancel').addEventListener('click', () => dlg.close());
  document.getElementById('leadClose').addEventListener('click', () => dlg.close());
  document.getElementById('leadSubmit').addEventListener('click', submit);
  emailEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
})();
