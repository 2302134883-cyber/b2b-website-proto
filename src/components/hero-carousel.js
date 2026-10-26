const slides = document.querySelectorAll('[data-slide]');
  const dotsBox = document.getElementById('dots');
  const heroSec = document.querySelector('[data-slide]').closest('section');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, timer, paused = false;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'w-2 h-2 rounded-full transition-colors ' + (i === 0 ? 'bg-gray-800' : 'bg-gray-300');
    d.setAttribute('data-i18n-aria', 'hero.dot.' + (i + 1));
    d.setAttribute('aria-label', '第 ' + (i + 1) + ' 页');
    d.onclick = () => go(i);
    dotsBox.appendChild(d);
  });
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('on', j === cur));
    dotsBox.querySelectorAll('button').forEach((d, j) => d.className = 'w-2 h-2 rounded-full transition-colors ' + (j === cur ? 'bg-gray-800' : 'bg-gray-300'));
    restart();
  }
  function restart() {
    clearInterval(timer);
    if (!reducedMotion && !paused && !document.hidden) timer = setInterval(() => go(cur + 1), 5000);
  }
  heroSec.addEventListener('mouseenter', () => { paused = true; restart(); });
  heroSec.addEventListener('mouseleave', () => { paused = false; restart(); });
  heroSec.addEventListener('focusin', () => { paused = true; restart(); });
  heroSec.addEventListener('focusout', () => { paused = false; restart(); });
  document.addEventListener('visibilitychange', restart);
  document.getElementById('prev').onclick = () => go(cur - 1);
  document.getElementById('next').onclick = () => go(cur + 1);
  restart();
