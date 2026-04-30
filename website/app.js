/* ────────────────────────────────────────────
   app.js  —  Website interactivity
   ──────────────────────────────────────────── */

// ── Nav scroll effect ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.borderBottomColor = window.scrollY > 10 ? '#2a2a2a' : '#1e1e1e';
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Install tab toggle ──
const tabs   = document.querySelectorAll('.install-tab');
const codeEl = document.getElementById('install-code-text');
const cmds   = { npm: 'npm install @abhay557/fakedata', pip: 'pip install fakedata-python' };
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (codeEl) codeEl.textContent = cmds[tab.dataset.lang];
  });
});

// ── Copy install button ──
const copyInstall = document.getElementById('copy-install');
if (copyInstall && codeEl) {
  copyInstall.addEventListener('click', () => {
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      copyInstall.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#68d391" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        copyInstall.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      }, 1800);
    });
  });
}

// ── Copy snippet helper ──
window.copyText = function(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = '#68d391';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1800);
  });
};

// ── Live Demo generators ──
function fmt(obj) { return JSON.stringify(obj, null, 2); }

function setOutput(elId, data) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = fmt(data);
    el.classList.add('loaded');
    el.style.opacity = '1';
    el.style.transition = 'opacity 250ms ease';
  }, 120);
}

window.genUser    = function() { setOutput('out-user',    generateUser()); };
window.genPokemon = function() { setOutput('out-pokemon', generatePokemon()); };
window.genJoke    = function() { setOutput('out-joke',    generateJoke()); };
window.genAnime   = function() { setOutput('out-anime',   generateAnime()); };

// Auto-generate on load
window.addEventListener('DOMContentLoaded', () => {
  genUser(); genPokemon(); genJoke(); genAnime();
});

// ── Animated Counters ──
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target === 0 ? '0' : target + '+';
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ── Usecase card fade-in observer ──
const cards = document.querySelectorAll('.usecase-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => {
        e.target.style.animationDelay = '0ms';
        e.target.style.animationPlayState = 'running';
      }, delay);
      cardObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => {
  c.style.animationPlayState = 'paused';
  cardObserver.observe(c);
});
