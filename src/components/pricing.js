(function () {
  /* 报价三步：悬停步骤按钮或对应卡片 → 紫色移到该步；移出 #q-flow 回 ① */
  const flow = document.getElementById('q-flow');
  if (flow) {
    const steps = [...flow.querySelectorAll('.q-step')];
    const set = (s) => steps.forEach((t) => t.classList.toggle('on', t.dataset.step === s));
    flow.querySelectorAll('[data-step]').forEach((z) => {
      z.addEventListener('mouseenter', () => set(z.dataset.step));
      z.addEventListener('click', () => set(z.dataset.step));   /* 点下面内容，上面紫色同步 */
    });
    flow.addEventListener('mouseleave', () => set('1'));
  }
})();
