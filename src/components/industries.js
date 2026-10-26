(function () {
      var root = document.getElementById('industrySolutions');
      if (!root) return;
      var tabs = Array.prototype.slice.call(root.querySelectorAll('.ind-tab'));
      var panes = Array.prototype.slice.call(root.querySelectorAll('.ind-pane'));
      var stage = document.getElementById('indPanes');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var current = 0;

      function syncHeight() {
        var max = 0;
        panes.forEach(function (pane) {
          pane.style.cssText = 'display:grid;visibility:hidden;position:absolute;left:0;right:0;top:0;';
          max = Math.max(max, pane.offsetHeight);
          pane.style.cssText = '';
        });
        stage.style.minHeight = max + 'px';
      }

      function go(index, focusTab) {
        current = (index + tabs.length) % tabs.length;
        tabs.forEach(function (tab, i) {
          var on = i === current;
          tab.classList.toggle('on', on);
          tab.setAttribute('aria-selected', on ? 'true' : 'false');
          tab.tabIndex = on ? 0 : -1;
        });
        panes.forEach(function (pane, i) {
          var on = i === current;
          pane.hidden = !on;
          pane.classList.toggle('on', on);
        });
        if (focusTab) tabs[current].focus();
      }

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
