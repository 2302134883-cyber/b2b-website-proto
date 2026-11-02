/* ============ 医疗器械子页面交互 ============
 * 1) 角色 tabs 切换痛点面板
 * 2) 痛点卡手风琴（机制三问）
 * 3) 合规之旅：自动播放 + 节点点击查看（订单圆点沿轨道行进）
 * 4) 系统共存：业务/技术视角切换
 * 5) data-md-scroll：平滑滚动
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 平滑滚动 ---- */
  document.querySelectorAll('[data-md-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-md-scroll'));
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---- 角色 tabs ---- */
  const roleTabs = [...document.querySelectorAll('.md-role-tab')];
  const rolePanes = [...document.querySelectorAll('.md-role-pane')];
  roleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      roleTabs.forEach((t2) => {
        const on = t2 === tab;
        t2.classList.toggle('on', on);
        t2.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      rolePanes.forEach((pane) => {
        const on = pane.getAttribute('data-pane') === tab.getAttribute('data-role');
        pane.classList.toggle('on', on);
        pane.hidden = !on;
      });
      document.querySelectorAll('.md-pain.flipped').forEach((card) => {
        card.classList.remove('flipped');
        card.setAttribute('aria-pressed', 'false');
      });
    });
  });

  /* ---- 痛点翻卡 ---- */
  const painCards = [...document.querySelectorAll('.md-pain')];
  painCards.forEach((card) => {
    const flip = () => {
      const on = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-md-scroll]')) return;
      flip();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      flip();
    });
  });

  /* ---- 合规之旅：3D 节点 + 右侧模块 ---- */
  const scene = document.querySelector('.md3d-scene');
  if (scene) {
    const getNodes = () => [...scene.querySelectorAll('.md3d-step')];
    const panels = [...document.querySelectorAll('.md-j-panel')];
    const playBtn = document.getElementById('mdJPlay');
    const playLabel = document.getElementById('mdJPlayLabel');
    let current = -1;
    let playing = false;
    let timer = null;

    function t(key) { return window.__i18nT?.(key) ?? ''; }

    function step(idx, fromUser) {
      current = idx;
      const nodes = getNodes();
      nodes.forEach((n, i) => {
        n.classList.toggle('is-active', i === idx);
        n.classList.toggle('is-done', i < idx);
        n.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
      });
      panels.forEach((p, i) => {
        const on = i === idx;
        p.hidden = !on;
        p.classList.toggle('on', on);
      });
      scene.dispatchEvent(new CustomEvent('md3d:step', { detail: { index: idx } }));
      if (fromUser) pause();
    }

    function next() {
      const count = getNodes().length;
      if (count) step((current + 1) % count);
    }

    function play() {
      if (reduced) { pause(); return; } // reduced-motion：不自动播放
      playing = true;
      playBtn?.classList.remove('paused');
      playBtn?.setAttribute('aria-pressed', 'true');
      if (playLabel) playLabel.textContent = t('md.j.pause') || playLabel.textContent;
      timer = setInterval(next, 2800);
    }

    function pause() {
      playing = false;
      clearInterval(timer); timer = null;
      playBtn?.classList.add('paused');
      playBtn?.setAttribute('aria-pressed', 'false');
      if (playLabel) playLabel.textContent = t('md.j.play') || playLabel.textContent;
    }

    playBtn?.addEventListener('click', () => (playing ? pause() : play()));
    scene.addEventListener('md3d:select', (event) => step(event.detail.index, true));

    document.addEventListener('i18n:applied', () => {
      if (playLabel) playLabel.textContent = playing ? t('md.j.pause') : t('md.j.play');
    });

    step(0);
    play();
  }

  /* ---- 系统共存视角切换 ---- */
  const coBtns = [...document.querySelectorAll('.md-co-btn')];
  const coPanels = [...document.querySelectorAll('.md-co-panel')];
  coBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      coBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      coPanels.forEach((p) => {
        const on = p.getAttribute('data-panel') === btn.getAttribute('data-view');
        p.classList.toggle('on', on);
        p.hidden = !on;
      });
    });
  });

  /* ---- 方案信息流：左侧选择，右侧详情 ---- */
  const solutionCards = [...document.querySelectorAll('.md-sol-card')];
  const detailPanel = document.getElementById('mdSolDetailPanel');
  if (detailPanel && solutionCards.length) {
    const showSolution = (card) => {
      solutionCards.forEach((item) => {
        const on = item === card;
        item.classList.toggle('on', on);
        item.querySelector('.md-sol-head')?.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const head = card.querySelector('.md-sol-head')?.cloneNode(true);
      const detail = card.querySelector('.md-sol-detail')?.cloneNode(true);
      detailPanel.replaceChildren();
      if (head) detailPanel.appendChild(head);
      if (detail) detailPanel.appendChild(detail);
      detailPanel.classList.remove('md-sol-detail-refresh');
      requestAnimationFrame(() => detailPanel.classList.add('md-sol-detail-refresh'));
    };
    solutionCards.forEach((card) => card.querySelector('.md-sol-head')?.addEventListener('click', () => showSolution(card)));
    showSolution(solutionCards[0]);
  }

  /* ---- 客户案例轮播 ---- */
  const caseCarousel = document.getElementById('mdCaseCarousel');
  if (caseCarousel) {
    const slides = [...caseCarousel.querySelectorAll('.md-case-slide')];
    const dots = [...document.querySelectorAll('.md-case-dot')];
    let current = 0;
    function showCase(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const on = i === current;
        slide.hidden = !on;
        slide.classList.toggle('on', on);
      });
      dots.forEach((dot, i) => {
        const on = i === current;
        dot.classList.toggle('on', on);
        dot.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    document.getElementById('mdCasePrev')?.addEventListener('click', () => showCase(current - 1));
    document.getElementById('mdCaseNext')?.addEventListener('click', () => showCase(current + 1));
    dots.forEach((dot) => dot.addEventListener('click', () => showCase(Number(dot.getAttribute('data-case-dot')))));
    caseCarousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showCase(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showCase(current + 1); }
    });
  }

  /* ---- 标题「医疗器械」独立打字机 ---- */
  const typeTarget = document.getElementById('mdIndustryType');
  if (typeTarget) {
    const text = typeTarget.textContent.trim();
    if (reduced) {
      typeTarget.classList.add('done');
    } else {
      let started = false;
      const observer = new IntersectionObserver((entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer.disconnect();
        typeTarget.textContent = '';
        let index = 0;
        const timer = window.setInterval(() => {
          index += 1;
          typeTarget.textContent = text.slice(0, index);
          if (index >= text.length) {
            window.clearInterval(timer);
            window.setTimeout(() => typeTarget.classList.add('done'), 1600);
          }
        }, 105);
      }, { threshold: 0.6 });
      observer.observe(typeTarget);
    }
  }
})();
