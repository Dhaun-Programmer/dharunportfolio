// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HERO GRID CANVAS =====
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let W, H, cols, rows;

function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  cols = Math.floor(W / 60);
  rows = Math.floor(H / 60);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const dots = [];
for (let i = 0; i < 80; i++) {
  dots.push({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1
  });
}

function drawGrid() {
  ctx.clearRect(0, 0, W, H);

  // grid lines
  ctx.strokeStyle = 'rgba(124,111,205,0.07)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // animated dots
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
    if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;

    ctx.beginPath();
    ctx.arc(d.x * W, d.y * H, d.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167,139,250,${d.opacity})`;
    ctx.fill();
  });

  // connections
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = (dots[i].x - dots[j].x) * W;
      const dy = (dots[i].y - dots[j].y) * H;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x * W, dots[i].y * H);
        ctx.lineTo(dots[j].x * W, dots[j].y * H);
        ctx.strokeStyle = `rgba(124,111,205,${0.12 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

// ===== TERMINAL TYPER =====
const lines = [
  { text: '$ whoami', cls: 'cmd', delay: 400 },
  { text: '  dharun_v — cse student', cls: 'val', delay: 900 },
  { text: '$ cat interests.txt', cls: 'cmd', delay: 1500 },
  { text: '  web dev, ai/ml, open source', cls: 'val', delay: 2100 },
  { text: '$ git log --oneline -3', cls: 'cmd', delay: 2800 },
  { text: '  a9f3c21 fix: auth bug in prod', cls: 'comment', delay: 3300 },
  { text: '  82b1e04 feat: add dark mode', cls: 'comment', delay: 3500 },
  { text: '  3d7a910 init: new project setup', cls: 'comment', delay: 3700 },
  { text: '$ █', cls: 'cmd', delay: 4200 },
];

const termEl = document.getElementById('terminal-text');
if (termEl) {
  lines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = cls;
      div.textContent = text;
      // remove cursor from last line before adding new
      const prev = termEl.querySelector('.cursor-line');
      if (prev) prev.classList.remove('cursor-line');
      termEl.appendChild(div);
    }, delay);
  });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.about-grid, .project-card, .tl-item, .skill-group, .contact-form, .contact-links, .section-title'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// The form will now use native HTML action="mailto:..." to send the email directly.

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));
