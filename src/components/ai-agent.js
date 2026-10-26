(function () {
      function init() {
        var root = document.getElementById('aiAgent');
        if (!root) return;
        var zone = document.getElementById('agOrbZone');
        var follow = document.getElementById('agFollow');
        var statusEl = document.getElementById('agStatus');
        var thread = document.getElementById('agThread');
        var emptyEl = document.getElementById('agEmpty');
        var qBtns = Array.prototype.slice.call(root.querySelectorAll('.ag-q'));
        var sceneTabs = Array.prototype.slice.call(root.querySelectorAll('.ag-scenes .arch-tab'));
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var state = 'idle', busy = false, streamTimer = null, idleTimer = null;

        function tr(key) {
          var el = document.querySelector('#agTpls [data-i18n="' + key + '"]') || document.querySelector('[data-i18n="' + key + '"]');
          return el ? el.textContent : key;
        }
        function setState(s) {
          state = s;
          root.setAttribute('data-state', s);
          statusEl.setAttribute('data-i18n', 'ag.status.' + s);
          statusEl.textContent = tr('ag.status.' + s);
        }

        /* 戳一戳 */
        function poke() {
          if (reduced) return;
          zone.classList.remove('poke'); void zone.offsetWidth; zone.classList.add('poke');
        }
        zone.addEventListener('click', poke);
        zone.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); }
        });
        zone.querySelector('.ag-breathe').addEventListener('animationend', function (e) {
          if (e.animationName === 'agPoke') zone.classList.remove('poke');
        });

        /* 倾听：光标跟随 + 状态提示 */
        if (!reduced && window.matchMedia('(hover: hover)').matches) {
          var tx = 0, ty = 0, fx = 0, fy = 0;
          zone.addEventListener('mousemove', function (e) {
            var r = zone.getBoundingClientRect();
            tx = ((e.clientX - r.left) / r.width - .5) * 20;
            ty = ((e.clientY - r.top) / r.height - .5) * 20;
          });
          zone.addEventListener('mouseenter', function () { if (state === 'idle') setState('listen'); });
          zone.addEventListener('mouseleave', function () { tx = 0; ty = 0; if (state === 'listen') setState('idle'); });
          (function loop() {
            fx += (tx - fx) * .08; fy += (ty - fy) * .08;
            follow.style.transform = 'translate(' + fx.toFixed(1) + 'px,' + fy.toFixed(1) + 'px)';
            requestAnimationFrame(loop);
          })();
        }

        /* 场景切换 */
        sceneTabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            if (busy || tab.classList.contains('on')) return;
            sceneTabs.forEach(function (t2) {
              var on = t2 === tab;
              t2.classList.toggle('on', on);
              t2.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            qBtns.forEach(function (b) { b.classList.toggle('hide', b.getAttribute('data-scene') !== tab.getAttribute('data-scene')); });
            if (thread.querySelector('.ag-msg')) {
              thread.classList.add('fading');
              setTimeout(function () {
                thread.querySelectorAll('.ag-msg').forEach(function (m) { m.remove(); });
                emptyEl.style.display = '';
                thread.classList.remove('fading');
              }, reduced ? 0 : 200);
            }
            if (state !== 'think') setState('idle');
          });
        });

        /* 提问 → 思考 → 流式回答 */
        function addMsg(kind, text, key) {
          var m = document.createElement('div');
          m.className = 'ag-msg ' + kind;
          m.setAttribute('data-key', key);
          m.innerHTML = (kind === 'bot'
            ? '<svg class="ag-ava orb orb-slow" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="url(#orbAgent)"/></svg>'
            : '') + '<div class="ag-bubble"></div>';
          m.querySelector('.ag-bubble').textContent = text;
          thread.appendChild(m);
          var msgs = thread.querySelectorAll('.ag-msg');
          while (msgs.length > 4) { msgs[0].remove(); msgs = thread.querySelectorAll('.ag-msg'); }
          thread.scrollTop = thread.scrollHeight;
          return m.querySelector('.ag-bubble');
        }
        function streamText(el, text, done) {
          if (reduced) { el.textContent = text; if (done) done(); return; }
          var i = 0;
          streamTimer = setInterval(function () {
            i++;
            el.textContent = text.slice(0, i);
            thread.scrollTop = thread.scrollHeight;
            if (i >= text.length) { clearInterval(streamTimer); streamTimer = null; if (done) done(); }
          }, 24);
        }
        function ask(btn) {
          if (busy) return;
          busy = true;
          clearTimeout(idleTimer);
          qBtns.forEach(function (b) { b.disabled = true; });
          emptyEl.style.display = 'none';
          var qKey = btn.getAttribute('data-i18n');
          addMsg('user', btn.textContent, qKey);
          setState('think');
          var aKey = 'ag.a' + qKey.slice(-1);
          setTimeout(function () {
            setState('done');
            var bubble = addMsg('bot', '', aKey);
            streamText(bubble, tr(aKey), function () {
              busy = false;
              qBtns.forEach(function (b) { b.disabled = false; });
              idleTimer = setTimeout(function () { if (!busy && state === 'done') setState('idle'); }, 2600);
            });
          }, reduced ? 200 : 900 + Math.random() * 400);
        }
        qBtns.forEach(function (btn) { btn.addEventListener('click', function () { ask(btn); }); });

        /* 页脚 AI 场景入口：直达演示并切换对应场景。 */
        document.querySelectorAll('[data-ai-scene]').forEach(function (link) {
          link.addEventListener('click', function (event) {
            event.preventDefault();
            var menu = link.closest('md-menu');
            if (menu) menu.open = false;
            if (window.__closeSiteNavPanels) window.__closeSiteNavPanels();
            var scene = link.getAttribute('data-ai-scene');
            var tab = sceneTabs.find(function (item) { return item.getAttribute('data-scene') === scene; });
            if (tab) {
              tab.click();
              tab.focus({ preventScroll: true });
            }
            if (window.__closeSiteMobileNav) window.__closeSiteMobileNav();
            root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
            try { history.replaceState(null, '', '#aiAgent'); } catch (e) { /* file:// 下保留滚动 */ }
          });
        });

        /* 语言切换：刷新状态文案 + 已显示对话（打断进行中的流式输出） */
        document.addEventListener('i18n:applied', function () {
          statusEl.textContent = tr(statusEl.getAttribute('data-i18n'));
          if (streamTimer) {
            clearInterval(streamTimer); streamTimer = null;
            busy = false;
            qBtns.forEach(function (b) { b.disabled = false; });
          }
          thread.querySelectorAll('.ag-msg').forEach(function (m) {
            var k = m.getAttribute('data-key');
            if (k) m.querySelector('.ag-bubble').textContent = tr(k);
          });
        });

        setState('idle');
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
      else init();
    })();
