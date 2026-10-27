/* ============ Gemini Air · 轻量入场与轮播演绎 ============
 * 使用 WAAPI，结束后不保留动画类，避免覆盖卡片原有 hover / selected 状态。
 */
(function () {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsMotion = typeof Element.prototype.animate === 'function';
  if (motionQuery.matches || !supportsMotion) return;

  const easing = 'cubic-bezier(.22,.8,.36,1)';
  function animateElement(element, { delay = 0, duration = 560, scale = false, distance = 16 } = {}) {
    const from = scale
      ? { opacity: 0, transform: `translateY(${distance}px) scale(.94)` }
      : { opacity: 0, transform: `translateY(${distance}px)` };
    element.animate([from, { opacity: 1, transform: 'translateY(0) scale(1)' }], {
      duration,
      delay,
      easing,
      fill: 'backwards',
    });
  }

  /* Hero：首屏与后续轮播共用同一套克制的文字入场。 */
  const slides = [...document.querySelectorAll('#heroContent [data-slide]')];
  function animateSlide(slide) {
    const content = slide?.firstElementChild;
    if (!content) return;
    [...content.children].forEach((element, index) => {
      animateElement(element, { delay: index * 85, duration: 600, distance: 12 });
    });
  }
  const activeSlide = slides.find((slide) => slide.classList.contains('on'));
  if (activeSlide) animateSlide(activeSlide);

  if (typeof MutationObserver === 'function') {
    const slideObserver = new MutationObserver((records) => {
      records.forEach(({ target }) => {
        if (target.classList.contains('on')) animateSlide(target);
      });
    });
    slides.forEach((slide) => slideObserver.observe(slide, {
      attributes: true,
      attributeFilter: ['class'],
    }));
  }

  if (typeof IntersectionObserver !== 'function') return;

  /* 只处理首屏渲染时可见的静态内容，不干扰隐藏面板和既有证书动画。 */
  const selector = [
    '.sec-head',
    '.sec-sub',
    '.mode-tab',
    '.mode-stage',
    '.service-card',
    '.service-orb-frame',
    '#q-flow .q-step-cards > md-outlined-card',
    '.cc-stat',
    '.arch-role',
    '.arch-ava',
    '.tc-visual',
    '.tc-detail',
    '.ag-chat',
    '.about-address-card',
    '.about-company-card',
    '.final-cta-card',
  ].join(',');
  const targets = [...new Set(document.querySelectorAll(selector))]
    .filter((element) => element.getClientRects().length > 0);
  const groupOrders = new Map();
  const elementOrders = new WeakMap();

  targets.forEach((element) => {
    const parent = element.parentElement;
    const order = groupOrders.get(parent) || 0;
    groupOrders.set(parent, order + 1);
    elementOrders.set(element, Math.min(order, 3));
    const isIcon = element.matches('.service-orb-frame, .arch-ava');
    element.classList.add('air-pending');
    if (isIcon) element.classList.add('air-pending--scale');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      const isIcon = element.classList.contains('air-pending--scale');
      element.classList.remove('air-pending', 'air-pending--scale');
      animateElement(element, {
        delay: elementOrders.get(element) * 70,
        duration: isIcon ? 480 : 560,
        distance: isIcon ? 8 : 16,
        scale: isIcon,
      });
    });
  }, { threshold: .06, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((element) => observer.observe(element));
})();
