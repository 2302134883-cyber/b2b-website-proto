(function () {
      var root = document.getElementById('industrySolutions');
      if (!root) return;
      var tabs = Array.prototype.slice.call(root.querySelectorAll('.ind-tab'));
      var panes = Array.prototype.slice.call(root.querySelectorAll('.ind-pane'));
      var stage = document.getElementById('indPanes');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var current = 0, leaving = null;

      function syncHeight() {
        var max = 0;
        panes.forEach(function (pane) {
          pane.style.cssText = 'display:grid;visibility:hidden;position:absolute;left:0;right:0;top:0;';
          max = Math.max(max, pane.offsetHeight);
          pane.style.cssText = '';
        });
        stage.style.minHeight = max + 'px';
      }

      function go(index, focusTab, dir) {
        var prev = current;
        current = (index + tabs.length) % tabs.length;
        if (dir == null) dir = index >= prev ? 1 : -1;
        stage.setAttribute('data-dir', dir > 0 ? 'next' : 'prev');
        tabs.forEach(function (tab, i) {
          var on = i === current;
          tab.classList.toggle('on', on);
          tab.setAttribute('aria-selected', on ? 'true' : 'false');
          tab.tabIndex = on ? 0 : -1;
        });
        /* 横推：旧面板浮层推出，270ms 后藏掉；快速连点先立即收尾上一轮 */
        if (leaving) { leaving.classList.remove('on', 'ind-out'); leaving.hidden = true; leaving = null; }
        var oldPane = panes[prev];
        panes.forEach(function (pane, i) {
          var on = i === current;
          if (!on && pane !== oldPane) { pane.hidden = true; pane.classList.remove('on'); }
          if (on) { pane.hidden = false; pane.classList.add('on'); }
        });
        if (!reduced && oldPane !== panes[current]) {
          oldPane.hidden = false;
          oldPane.classList.remove('on');
          oldPane.classList.add('ind-out');
          leaving = oldPane;
          setTimeout(function () {
            if (leaving === oldPane) { oldPane.classList.remove('ind-out'); oldPane.hidden = true; leaving = null; }
          }, 270);
        } else if (oldPane !== panes[current]) {
          oldPane.classList.remove('on'); oldPane.hidden = true;
        }
        if (focusTab) tabs[current].focus();
        startAuto();
      }

      /* 自动轮播：滚入视野 2s 后播第一档，之后 3s 一档；离开视野 / 悬停 / 聚焦 / 切后台暂停，reduced-motion 不自动播 */
      var autoTimer = null, firstTimer = null, hovering = false, focusing = false, inView = false;
      function stopAuto() { clearInterval(autoTimer); autoTimer = null; clearTimeout(firstTimer); firstTimer = null; }
      function startAuto() {
        stopAuto();
        if (reduced || !inView || hovering || focusing || document.hidden) return;
        autoTimer = setInterval(function () { go(current + 1, false, 1); }, 3000);
      }
      root.addEventListener('mouseenter', function () { hovering = true; startAuto(); });
      root.addEventListener('mouseleave', function () { hovering = false; startAuto(); });
      root.addEventListener('focusin', function () { focusing = true; startAuto(); });
      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) { focusing = false; startAuto(); }
      });
      document.addEventListener('visibilitychange', startAuto);
      new IntersectionObserver(function (entries) {
        var was = inView;
        inView = entries[0].isIntersecting;
        if (inView && !was && !reduced && !hovering && !focusing && !document.hidden) {
          /* 刚滚入视野：2s 后播第一档，之后回到 3s 节奏 */
          stopAuto();
          firstTimer = setTimeout(function () { go(current + 1, false, 1); }, 2000);
        } else {
          startAuto();
        }
      }, { threshold: 0.25 }).observe(root);

      var prevBtn = document.getElementById('indPrev');
      var nextBtn = document.getElementById('indNext');
      if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1, false, -1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1, false, 1); });

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { go(i, false); });
      });
      root.querySelector('.ind-tabs').addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = current + 1;
        if (event.key === 'ArrowLeft') next = current - 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== null) { event.preventDefault(); go(next, true); }
      });

      root.querySelectorAll('[data-case-index]').forEach(function (button) {
        button.addEventListener('click', function () {
          var index = Number(button.getAttribute('data-case-index'));
          var chain = document.getElementById('caseChain');
          var caseTabs = chain ? chain.querySelectorAll('.cc-node') : [];
          if (caseTabs[index]) caseTabs[index].click();
          var heading = document.getElementById('caseStudies');
          if (heading) heading.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
          if (caseTabs[index]) caseTabs[index].focus({ preventScroll: true });
        });
      });
      var explore = root.querySelector('[data-industry-explore]');
      if (explore) explore.addEventListener('click', function () {
        var section = document.getElementById('sec-what');
        var heading = section ? section.querySelector('.sec-head h2') : null;
        if (section) section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      });
      /* 事件委托覆盖页眉、移动菜单与页脚；行业入口同时定位并选中对应 Tab。 */
      document.addEventListener('click', function (event) {
        var item = event.target.closest ? event.target.closest('[data-industry-menu]') : null;
        if (!item) return;
        event.preventDefault();
        var selected = tabs[Number(item.getAttribute('data-industry-menu'))];
        go(Number(item.getAttribute('data-industry-menu')), false);
        var menu = item.closest('md-menu');
        if (menu) {
          menu.skipRestoreFocus = true;
          menu.addEventListener('closed', function () {
            if (selected) selected.focus({ preventScroll: true });
          }, { once: true });
          menu.open = false;
        } else if (selected) {
          selected.focus({ preventScroll: true });
        }
        if (window.__closeSiteMobileNav) window.__closeSiteMobileNav();
        if (window.__closeSiteNavPanels) window.__closeSiteNavPanels();
        root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        try { history.replaceState(null, '', '#industrySolutions'); } catch (e) { /* file:// 下保留滚动 */ }
      });

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(syncHeight, 180);
      });
      document.addEventListener('i18n:applied', function () { setTimeout(syncHeight, 0); });
      window.addEventListener('load', syncHeight);
      syncHeight();
    })();
