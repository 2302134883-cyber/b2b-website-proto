(function () {
      var list = document.getElementById('faqList');
      if (!list) return;
      list.querySelectorAll('.qa-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.parentElement;
          var open = item.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
    })();
