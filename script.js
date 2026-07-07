/* ========================================================
   INSPIRE 2026 — Main Script
   ======================================================== */

/* ---- Custom Cursor ---- */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function trailLoop() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(trailLoop);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
})();

/* ---- Loading Screen ---- */
(function initLoading() {
  const screen  = document.getElementById('loading-screen');
  const content = document.getElementById('main-content');
  if (!screen) return;

  const minTime = 2200;
  const start   = Date.now();

  function reveal() {
    const elapsed = Date.now() - start;
    const delay   = Math.max(0, minTime - elapsed);
    setTimeout(() => {
      screen.classList.add('hidden');
      if (content) content.classList.add('visible');
      initFadeUps();
    }, delay);
  }

  if (document.readyState === 'complete') {
    reveal();
  } else {
    window.addEventListener('load', reveal);
  }
})();

/* ---- Scroll Fade-Up Animations ---- */
function initFadeUps() {
  const els = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ---- Button Ripple ---- */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const r    = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      r.className = 'ripple';
      r.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX-rect.left-size/2}px;
        top:${e.clientY-rect.top-size/2}px;
      `;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
})();

/* ---- Particles Canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomColor() {
    const picks = [
      'rgba(255,215,0,',
      'rgba(255,140,0,',
      'rgba(200,20,30,',
      'rgba(255,248,231,',
    ];
    return picks[Math.floor(Math.random() * picks.length)];
  }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:    Math.random() * 2000,
      y:    Math.random() * 2000,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      r:    Math.random() * 1.8 + 0.4,
      a:    Math.random() * 0.6 + 0.15,
      c:    randomColor(),
      maxA: Math.random() * 0.6 + 0.2,
      da:   (Math.random() - 0.5) * 0.008,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.a  += p.da;
      if (p.a > p.maxA || p.a < 0.05) p.da *= -1;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.shadowColor = p.c + '0.8)';
      ctx.shadowBlur  = 6;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Golden Lines Canvas ---- */
(function initLines() {
  const canvas = document.getElementById('lines-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const LINES = [];
  const LINE_COUNT = 6;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < LINE_COUNT; i++) {
    LINES.push({
      x1:    Math.random() * 1.2 - 0.1,
      y1:    Math.random(),
      x2:    Math.random() * 1.2 - 0.1,
      y2:    Math.random(),
      speed: (Math.random() * 0.0003 + 0.0001) * (Math.random() < 0.5 ? 1 : -1),
      a:     Math.random() * 0.12 + 0.03,
      w:     Math.random() * 0.8 + 0.3,
      progress: Math.random(),
      dir: Math.random() < 0.5 ? 1 : -1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    LINES.forEach(ln => {
      ln.progress += ln.speed;
      if (ln.progress > 1) { ln.progress = 0; ln.y1 = Math.random(); ln.y2 = Math.random(); ln.x1 = Math.random() * 1.2 - 0.1; ln.x2 = Math.random() * 1.2 - 0.1; }
      if (ln.progress < 0) { ln.progress = 1; }

      const gx1 = ln.x1 * W, gy1 = ln.y1 * H;
      const gx2 = ln.x2 * W, gy2 = ln.y2 * H;

      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      grad.addColorStop(0,           'rgba(255,215,0,0)');
      grad.addColorStop(ln.progress, `rgba(255,215,0,${ln.a})`);
      grad.addColorStop(Math.min(1, ln.progress + 0.15), 'rgba(255,140,0,0)');
      grad.addColorStop(1,           'rgba(255,215,0,0)');

      ctx.beginPath();
      ctx.moveTo(gx1, gy1);
      ctx.lineTo(gx2, gy2);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = ln.w;
      ctx.globalAlpha = 1;
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Ember Particles ---- */
(function initEmbers() {
  const layer = document.getElementById('embers-layer');
  if (!layer) return;

  const COUNT = 22;
  const embers = [];

  for (let i = 0; i < COUNT; i++) createEmber(true);

  function createEmber(init) {
    const el = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const x    = Math.random() * 100;
    const dur  = Math.random() * 8 + 5;
    const delay = init ? -(Math.random() * dur) : 0;

    el.style.cssText = `
      position:absolute;
      bottom:0;
      left:${x}%;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(255,215,0,0.95), rgba(255,100,0,0.5));
      box-shadow:0 0 ${size*2}px rgba(255,180,0,0.8);
      animation:emberRise ${dur}s ${delay}s ease-in infinite;
      pointer-events:none;
    `;
    layer.appendChild(el);
    embers.push({ el, x, dur });
  }

  // CSS for ember rise
  const style = document.createElement('style');
  style.textContent = `
    @keyframes emberRise {
      0%   { transform:translateY(0) translateX(0) scale(1); opacity:0.9; }
      50%  { transform:translateY(-40vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random()*60+20)}px) scale(0.6); opacity:0.6; }
      100% { transform:translateY(-90vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random()*80+10)}px) scale(0.1); opacity:0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ---- Fire Canvas (bottom) ---- */
(function initFire() {
  const canvas = document.getElementById('fire-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const SPARKS = [];
  const SPARK_COUNT = 40;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = 220;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < SPARK_COUNT; i++) {
    SPARKS.push(newSpark(true));
  }

  function newSpark(init) {
    return {
      x:   Math.random() * (typeof W !== 'undefined' ? W : 800),
      y:   H + Math.random() * 20,
      vx:  (Math.random() - 0.5) * 1.2,
      vy:  -(Math.random() * 2.5 + 1),
      life:init ? Math.random() : 0,
      maxLife: Math.random() * 0.7 + 0.4,
      r:   Math.random() * 4 + 1.5,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Glowing base
    const grad = ctx.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0,    'rgba(255,80,0,0.15)');
    grad.addColorStop(0.3,  'rgba(255,50,0,0.06)');
    grad.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    SPARKS.forEach((s, idx) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life += 0.018;

      if (s.life >= s.maxLife) {
        SPARKS[idx] = newSpark(false);
        return;
      }

      const progress = s.life / s.maxLife;
      const alpha    = Math.sin(progress * Math.PI) * 0.85;
      const r        = s.r * (1 - progress * 0.4);

      const colors = [
        `rgba(255,220,0,${alpha})`,
        `rgba(255,140,0,${alpha})`,
        `rgba(255,60,0,${alpha})`,
        `rgba(255,200,50,${alpha})`,
      ];
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle   = colors[idx % colors.length];
      ctx.shadowColor = 'rgba(255,150,0,0.8)';
      ctx.shadowBlur  = 10;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Smoke Layer CSS Keyframes (dynamic) ---- */
(function addSmokeFrames() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes smokeRise {
      0%   { opacity:0; transform:translateY(0) scaleX(1) rotate(0deg); }
      30%  { opacity:0.15; }
      70%  { opacity:0.08; }
      100% { opacity:0; transform:translateY(-35vh) scaleX(1.6) rotate(5deg); }
    }
  `;
  document.head.appendChild(style);

  const layer = document.querySelector('.bg-smoke');
  if (!layer) return;
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    const w = Math.random() * 200 + 80;
    const left = Math.random() * 100;
    const dur  = Math.random() * 14 + 10;
    const del  = -(Math.random() * dur);
    s.style.cssText = `
      position:absolute;
      bottom:0;
      left:${left}%;
      width:${w}px;
      height:${w}px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(40,20,10,0.18) 0%, transparent 70%);
      animation:smokeRise ${dur}s ${del}s ease-in infinite;
      filter:blur(18px);
      pointer-events:none;
    `;
    layer.appendChild(s);
  }
})();
