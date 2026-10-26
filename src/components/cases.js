(function () {
      var chain = document.getElementById('caseChain');
      if (!chain) return;
      var stage = document.getElementById('ccStage');
      var nodes = Array.prototype.slice.call(chain.querySelectorAll('.cc-node'));
      var links = Array.prototype.slice.call(chain.querySelectorAll('.cc-link'));
      var panes = Array.prototype.slice.call(chain.querySelectorAll('.cc-pane'));
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cur = 0, timer = null, inView = false, firstIn = false, DUR = 8000;

      function fmt(n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n); }
      function countUp(pane) {
        var el = pane.querySelector('.cc-statnum');
        if (!el) return;
        var target = parseInt(el.getAttribute('data-value'), 10) || 0;
        if (reduced) { el.textContent = fmt(target); return; }
        var t0 = performance.now(), dur = 900;
        (function tick(t) {
          var p = Math.min((t - t0) / dur, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }

      function go(i) {
        cur = (i + nodes.length) % nodes.length;
        nodes.forEach(function (n, j) {
          n.classList.toggle('on', j === cur);
          n.setAttribute('aria-selected', j === cur ? 'true' : 'false');
        });
        links.forEach(function (l, j) { l.classList.toggle('fill', j < cur); });
        panes.forEach(function (p, j) {
          var on = j === cur;
          if (on && !p.classList.contains('on')) { p.classList.add('on'); countUp(p); }
          else if (!on) { p.classList.remove('on'); }
        });
        restart();
      }

      function restart() {
        clearInterval(timer);
        if (reduced || !inView) return;
        timer = setInterval(function () { go(cur + 1); }, DUR);
      }

      nodes.forEach(function (n, i) {
        n.addEventListener('click', function () { go(i); });
      });
      chain.querySelector('.cc-chain').addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      });
      chain.addEventListener('mouseenter', function () { clearInterval(timer); });
      chain.addEventListener('mouseleave', restart);

      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView && !firstIn) { firstIn = true; countUp(panes[cur]); }
        if (inView) restart(); else clearInterval(timer);
      }, { threshold: 0.3 }).observe(chain);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearInterval(timer); else restart();
      });

      /* 锁定舞台高度，切换时页面不跳动 */
      function syncStageHeight() {
        var max = 0;
        panes.forEach(function (p) {
          p.style.cssText = 'display:grid;visibility:hidden;position:absolute;left:0;right:0;';
          max = Math.max(max, p.offsetHeight);
          p.style.cssText = '';
        });
        stage.style.minHeight = max + 'px';
      }
      var rz;
      window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(syncStageHeight, 200); });
      window.addEventListener('load', syncStageHeight);
      syncStageHeight();
    })();
