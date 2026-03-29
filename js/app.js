/* ─────────────────────────────────────────
   HeliosWatch — App JavaScript
   ───────────────────────────────────────── */

// ── Risk Level Data ──────────────────────────────────────────────────────────
const RISK_LEVELS = {
  low: {
    label: 'LOW',
    desc: 'Geomagnetic conditions are calm. Safe for all activities.',
    color: '#22c55e',
    fill: 18,
    numValue: 18,
  },
  moderate: {
    label: 'MODERATE',
    desc: 'Minor disturbances detected. Sensitive electronics may be affected.',
    color: '#facc15',
    fill: 45,
    numValue: 45,
  },
  high: {
    label: 'HIGH',
    desc: 'Strong solar wind detected. Possible GPS/radio disruptions.',
    color: '#f97316',
    fill: 70,
    numValue: 70,
  },
  extreme: {
    label: 'EXTREME',
    desc: 'Severe geomagnetic storm in progress. Take protective measures.',
    color: '#ef4444',
    fill: 92,
    numValue: 92,
  },
};

// ── Risk Simulator ────────────────────────────────────────────────────────────
function setRiskLevel(level) {
  const data   = RISK_LEVELS[level];
  const fill   = document.getElementById('risk-fill');
  const label  = document.getElementById('risk-level-label');
  const desc   = document.getElementById('risk-level-desc');
  const btns   = document.querySelectorAll('.risk-btn');

  if (!fill || !label || !desc) return;

  // Update fill bar
  fill.style.width = data.fill + '%';
  fill.style.boxShadow = `0 0 18px ${data.color}55`;

  // Update label
  label.textContent  = data.label;
  label.style.color  = data.color;
  label.style.textShadow = `0 0 20px ${data.color}80`;

  // Update description
  desc.textContent = data.desc;

  // Toggle active button
  btns.forEach(btn => btn.classList.toggle('active', btn.dataset.level === level));
}

// ── Stats Counter Animation ───────────────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const start    = 0;
  const duration = 1800;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(ease * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── Smooth scroll for nav links ───────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Scroll-reveal animation ───────────────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.feature-card, .step, .preview-frame, .stat-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ── Download button click analytics (local) ───────────────────────────────────
function initDownloadTracking() {
  document.querySelectorAll('[data-track="download"]').forEach(btn => {
    btn.addEventListener('click', () => {
      console.info('[HeliosWatch] APK download initiated');
      btn.innerHTML = btn.innerHTML.replace('Download APK', 'Downloading…');
      setTimeout(() => {
        btn.innerHTML = btn.innerHTML.replace('Downloading…', 'Download APK');
      }, 3000);
    });
  });
}

// ── Live solar "activity" ticker (simulated) ──────────────────────────────────
function initActivityTicker() {
  const ticker = document.getElementById('live-kp');
  if (!ticker) return;

  const kpValues = [2.3, 3.1, 2.7, 4.0, 3.5, 2.0, 5.1, 4.7, 3.9, 2.5];
  let idx = 0;

  function update() {
    const val = kpValues[idx % kpValues.length];
    ticker.textContent = 'Kp ' + val.toFixed(1);
    idx++;
    setTimeout(update, 2800);
  }
  update();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Default risk level display
  setRiskLevel('moderate');

  // Bind risk simulator buttons
  document.querySelectorAll('.risk-btn').forEach(btn => {
    btn.addEventListener('click', () => setRiskLevel(btn.dataset.level));
  });

  initCounters();
  initSmoothScroll();
  initScrollReveal();
  initDownloadTracking();
  initActivityTicker();
});
