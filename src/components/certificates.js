(function () {
      var row = document.getElementById('certRow');
      if (!row) return;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reduced.matches) { row.classList.add('certs-done'); return; }
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        row.classList.add('certs-in');
        var last = row.lastElementChild;
        last.addEventListener('animationend', function () { row.classList.add('certs-done'); }, { once: true });
      }, { threshold: 0.3 }).observe(row);
    })();
