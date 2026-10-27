// ---- Hero orb ⇄ 品牌 X 形变（往返切换） ----
  const CIRCLE=[[[144,176.21],[139.43,178.67],[134.72,180.86],[129.89,182.77],[124.96,184.39],[119.94,185.71],[114.85,186.74],[109.71,187.46],[104.54,187.88],[99.35,188],[94.16,187.81],[89,187.31],[83.87,186.51],[78.79,185.41],[73.8,184.01],[68.89,182.32],[64.09,180.34],[59.41,178.08],[54.88,175.55],[50.5,172.76],[46.3,169.72],[42.28,166.43],[38.47,162.91],[34.86,159.17],[31.49,155.23],[28.35,151.09],[25.46,146.78],[22.84,142.3],[20.47,137.68],[18.39,132.93],[16.59,128.06],[15.08,123.09],[13.87,118.04],[12.96,112.93],[12.34,107.78],[12.04,102.6],[12.04,97.4],[12.34,92.22],[12.96,87.07],[13.87,81.96],[15.08,76.91],[16.59,71.94],[18.39,67.07],[20.47,62.32],[22.84,57.7],[25.46,53.22],[28.35,48.91],[31.49,44.77],[34.86,40.83],[38.47,37.09],[42.28,33.57],[46.3,30.28],[50.5,27.24],[54.88,24.45],[59.41,21.92],[64.09,19.66],[68.89,17.68],[73.8,15.99],[78.79,14.59],[83.87,13.49],[89,12.69],[94.16,12.19],[99.35,12],[104.54,12.12],[109.71,12.54],[114.85,13.26],[119.94,14.29],[124.96,15.61],[129.89,17.23],[134.72,19.14],[139.43,21.33],[144,23.79]],[[15,77.22],[19.54,64.36],[26.01,52.36],[34.26,41.5],[44.09,32.04],[55.26,24.22],[67.51,18.22],[80.54,14.18],[94.03,12.2],[107.67,12.33],[121.12,14.57],[134.07,18.86],[146.2,25.1],[157.22,33.14],[166.86,42.78],[174.9,53.8],[181.14,65.93],[185.43,78.88],[187.67,92.33],[187.8,105.97],[185.82,119.46],[181.78,132.49],[175.78,144.74],[167.96,155.91],[158.5,165.74],[147.64,173.99],[135.64,180.46],[122.78,185]],[[122.78,15],[135.64,19.54],[147.64,26.01],[158.5,34.26],[167.96,44.09],[175.78,55.26],[181.78,67.51],[185.82,80.54],[187.8,94.03],[187.67,107.67],[185.43,121.12],[181.14,134.07],[174.9,146.2],[166.86,157.22],[157.22,166.86],[146.2,174.9],[134.07,181.14],[121.12,185.43],[107.67,187.67],[94.03,187.8],[80.54,185.82],[67.51,181.78],[55.26,175.78],[44.09,167.96],[34.26,158.5],[26.01,147.64],[19.54,135.64],[15,122.78]]];
const XSHAPE=[[[36.56,12],[41.09,16.54],[45.63,21.07],[48.45,26.32],[51.9,31.31],[56.44,35.85],[60.98,40.38],[65.51,44.92],[70.05,49.46],[72.24,54.97],[76.32,59.69],[80.86,64.23],[85.39,68.77],[89.93,73.3],[92.07,78.84],[96.2,83.54],[100.74,88.08],[105.28,92.61],[109.81,97.15],[111.9,102.7],[107.71,107.39],[103.17,111.92],[98.63,116.46],[96.03,121.8],[92.36,126.7],[87.83,131.23],[83.29,135.77],[78.75,140.31],[74.21,144.84],[72.24,150.44],[67.94,155.08],[63.41,159.62],[58.87,164.15],[54.33,168.69],[52.42,174.31],[48.06,178.93],[43.53,183.46],[38.99,188],[36.56,187.45],[36.56,181.04],[36.56,174.62],[36.56,168.2],[37.19,162.05],[40.52,157.01],[43.46,151.81],[47.99,147.28],[52.53,142.74],[57.07,138.2],[61.6,133.66],[64.31,128.37],[67.87,123.43],[72.41,118.89],[76.95,114.35],[81.49,109.82],[86.02,105.28],[85.65,100.74],[83.92,95.04],[79.38,90.51],[74.84,85.97],[70.31,81.43],[65.77,76.9],[61.23,72.36],[59.5,66.66],[54.96,62.12],[50.42,57.59],[45.89,53.05],[41.35,48.51],[39.62,42.81],[36.56,37.67],[36.56,31.25],[36.56,24.83],[36.56,18.42]],[[139.65,39.76],[144.67,39.76],[149.69,39.76],[154.71,39.76],[159.74,39.76],[163.44,41.07],[161.77,45.4],[158.22,48.95],[154.67,52.5],[151.12,56.05],[147.56,59.6],[144.01,63.15],[143.27,67.86],[139.72,71.41],[136.17,74.96],[132.62,78.51],[129.07,82.06],[125.52,81.13],[121.97,77.58],[118.42,74.03],[115.86,70.07],[117.6,65.77],[121.15,62.22],[124.7,58.67],[128.25,55.12],[131.72,51.53],[132.55,46.86],[136.1,43.31]],[[127.76,119.06],[131.31,122.61],[134.86,126.16],[135.69,130.84],[139.15,134.42],[142.7,137.97],[146.25,141.52],[149.8,145.07],[153.36,148.62],[156.91,152.17],[159.48,156.13],[161.2,160.44],[161.59,162.68],[156.57,162.68],[151.55,162.68],[146.53,162.68],[141.5,162.68],[137.41,160.44],[133.86,156.89],[130.31,153.33],[127.76,149.37],[126.01,145.07],[122.46,141.52],[118.91,137.97],[116.36,134.42],[119.83,130.84],[120.66,126.16],[124.21,122.61]]];
  const orbSvg = document.getElementById('heroOrb');
  const orbPath = document.getElementById('orbPath');
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const toD = (P) => P.map(sub => 'M' + sub.map(p => p.join(',')).join('L') + 'Z').join('');
  let reduced = motionQuery.matches;
  let isX = false, currentShape = CIRCLE, anim = null;
  let introStarted = false, introDone = false, introPaused = false;
  let waitTask = null, pausedWait = null, pausedTween = null;

  function setShape(P) {
    currentShape = P;
    orbPath.setAttribute('d', toD(P));
  }
  function setBreathing(on) {
    orbSvg.classList.toggle('is-breathing', Boolean(on && !isX && !reduced));
  }
  function applyVisualState() {
    if (isX) {
      // 保留当前角度再归零，避免 X 在随机角度停住。
      const matrix = getComputedStyle(orbSvg).transform;
      orbSvg.style.animation = 'none';
      orbSvg.style.transition = 'none';
      orbSvg.style.transform = matrix === 'none' ? 'rotate(0deg)' : matrix;
      requestAnimationFrame(() => {
        orbSvg.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
        orbSvg.style.transform = 'rotate(0deg)';
      });
    } else {
      orbSvg.style.transition = 'none';
      orbSvg.style.transform = '';
      orbSvg.style.animation = '';
    }
  }

  function tween(from, to, done, duration = 700) {
    if (reduced || duration <= 0) { setShape(to); done(); return; }
    if (anim) cancelAnimationFrame(anim.raf);
    const start = performance.now();
    anim = { to, done, duration, start, raf: null };
    const step = (now) => {
      if (!anim) return;
      const t = Math.min(1, (now - start) / duration);
      // easeInOutCubic + 轻微回弹，路径始终从当前画面继续。
      let p = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
      p += 0.07 * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI);
      setShape(from.map((fs, j) => fs.map((f, i) => [
        f[0] + (to[j][i][0] - f[0]) * p,
        f[1] + (to[j][i][1] - f[1]) * p,
      ])));
      if (t < 1) anim.raf = requestAnimationFrame(step);
      else {
        setShape(to);
        const callback = anim.done;
        anim = null;
        callback();
      }
    };
    anim.raf = requestAnimationFrame(step);
  }

  function schedule(callback, delay) {
    const task = { callback, remaining: delay, start: performance.now(), id: null };
    task.id = setTimeout(() => {
      if (waitTask !== task) return;
      waitTask = null;
      callback();
    }, delay);
    waitTask = task;
  }

  function morphTo(target, done) {
    isX = target === XSHAPE;
    orbSvg.setAttribute('aria-pressed', String(isX));
    setBreathing(false);
    applyVisualState();
    tween(currentShape, target, done);
  }

  function finishIntro() {
    introDone = true;
    introPaused = false;
    pausedWait = null;
    pausedTween = null;
    setBreathing(true);
  }

  function startIntro() {
    if (reduced || introStarted || introDone || document.hidden) return;
    introStarted = true;
    // 第 3 秒圆球 → X；第 6 秒 X → 圆球；完成后开始呼吸。
    schedule(() => {
      morphTo(XSHAPE, () => {
        schedule(() => morphTo(CIRCLE, finishIntro), 2300);
      });
    }, 3000);
  }

  function pauseIntro() {
    if (introDone || introPaused) return;
    introPaused = true;
    const now = performance.now();
    if (waitTask) {
      pausedWait = {
        callback: waitTask.callback,
        remaining: Math.max(0, waitTask.remaining - (now - waitTask.start)),
      };
      clearTimeout(waitTask.id);
      waitTask = null;
    }
    if (anim) {
      pausedTween = {
        to: anim.to,
        done: anim.done,
        remaining: Math.max(0, anim.duration - (now - anim.start)),
      };
      cancelAnimationFrame(anim.raf);
      anim = null;
    }
  }

  function resumeIntro() {
    if (!introPaused || introDone) return;
    introPaused = false;
    if (pausedTween) {
      const pending = pausedTween;
      pausedTween = null;
      tween(currentShape, pending.to, pending.done, pending.remaining);
    } else if (pausedWait) {
      const pending = pausedWait;
      pausedWait = null;
      schedule(pending.callback, pending.remaining);
    }
  }

  function cancelIntro() {
    introDone = true;
    introPaused = false;
    if (waitTask) { clearTimeout(waitTask.id); waitTask = null; }
    if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
    pausedWait = null;
    pausedTween = null;
    setBreathing(false);
  }

  function toggle() {
    cancelIntro();
    isX = !isX;
    orbSvg.setAttribute('aria-pressed', String(isX));
    applyVisualState();
    const target = isX ? XSHAPE : CIRCLE;
    if (reduced) { setShape(target); setBreathing(false); return; }
    tween(currentShape, target, () => { if (!isX) setBreathing(true); });
  }

  orbSvg.addEventListener('click', toggle);
  orbSvg.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (introDone || reduced) return;
    if (document.hidden) pauseIntro();
    else if (!introStarted) startIntro();
    else resumeIntro();
  });
  motionQuery.addEventListener('change', (event) => {
    reduced = event.matches;
    if (reduced) {
      cancelIntro();
      isX = false;
      orbSvg.setAttribute('aria-pressed', 'false');
      orbSvg.style.animation = 'none';
      orbSvg.style.transition = 'none';
      orbSvg.style.transform = 'rotate(0deg)';
      setShape(CIRCLE);
      setBreathing(false);
    } else {
      introDone = true; // 偏好转回后也不重播首次演示。
      applyVisualState();
      setBreathing(true);
    }
  });

  setShape(CIRCLE);
  if (!reduced) startIntro();
