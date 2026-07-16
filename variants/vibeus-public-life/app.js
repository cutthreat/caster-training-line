const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const journey = document.querySelector('[data-journey]');
const track = document.querySelector('[data-track]');
const progress = document.querySelector('[data-progress]');
const codeCanvas = document.querySelector('[data-code-rain]');
const foreground = document.querySelector('[data-code-foreground]');
const heroKicker = document.querySelector('[data-hero-kicker]');
const requestedHero = new URLSearchParams(window.location.search).get('hero') || 'code';
const activeHero = ['code', 'quantum', 'singularity'].includes(requestedHero) ? requestedHero : 'code';

document.body.classList.add(`hero-${activeHero}`);
heroKicker.textContent = {
  code: 'Из кода в реальный мир',
  quantum: 'Идеи создают новые связи',
  singularity: 'Не дайте проекту исчезнуть'
}[activeHero];

const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 900px)');

function updateJourney() {
  if (reducedMotion.matches || mobile.matches) {
    track.style.transform = '';
    progress.style.width = '';
    return;
  }
  const rect = journey.getBoundingClientRect();
  const scrollable = journey.offsetHeight - window.innerHeight;
  const current = Math.min(1, Math.max(0, -rect.top / scrollable));
  track.style.transform = `translate3d(${-current * 75}%, 0, 0)`;
  progress.style.width = `${current * 100}%`;
}

updateJourney();
window.addEventListener('scroll', updateJourney, { passive: true });
window.addEventListener('resize', updateJourney);
reducedMotion.addEventListener('change', updateJourney);
mobile.addEventListener('change', updateJourney);

const glyphs = '010101001101{}<>/VIBEUSPROJECTBUILDREACT'.split('');
let heroFrame;

function startHeroCanvas() {
  const context = codeCanvas.getContext('2d');
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = codeCanvas.clientWidth;
  const height = codeCanvas.clientHeight;
  codeCanvas.width = width * ratio;
  codeCanvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const size = mobile.matches ? 15 : 18;
  const columns = Math.ceil(width / size);
  const drops = Array.from({ length: columns }, () => Math.random() * -70);
  const stars = Array.from({ length: mobile.matches ? 90 : 180 }, () => ({ x: Math.random() * width, y: Math.random() * height, z: Math.random(), a: Math.random() }));
  let time = 0;

  function draw() {
    time += 0.008;
    if (activeHero !== 'code') {
      context.fillStyle = activeHero === 'quantum' ? 'rgba(2,6,9,.22)' : 'rgba(0,0,0,.2)';
      context.fillRect(0, 0, width, height);
      for (const star of stars) {
        if (activeHero === 'singularity') {
          const dx = star.x - width * 0.72;
          const dy = star.y - height * 0.5;
          const angle = Math.atan2(dy, dx) + 0.004 + star.z * 0.008;
          const distance = Math.max(25, Math.hypot(dx, dy) * (1 - 0.00035 * (1.2 - star.z)));
          star.x = width * 0.72 + Math.cos(angle) * distance;
          star.y = height * 0.5 + Math.sin(angle) * distance;
        } else {
          star.y += 0.08 + star.z * 0.25;
          star.x += Math.sin(time + star.y * 0.01) * 0.08;
        }
        if (star.y > height) star.y = 0;
        context.beginPath();
        context.fillStyle = activeHero === 'quantum' ? `rgba(165,225,255,${0.18 + star.a * 0.65})` : `rgba(255,190,150,${0.14 + star.a * 0.55})`;
        context.arc(star.x, star.y, 0.4 + star.z * 1.5, 0, Math.PI * 2);
        context.fill();
      }
      if (activeHero === 'quantum') {
        context.beginPath();
        context.strokeStyle = 'rgba(107,211,255,.12)';
        context.lineWidth = 1;
        for (let x = 0; x < width; x += 14) {
          const y = height * 0.5 + Math.sin(x * 0.012 + time * 4) * 48 + Math.sin(x * 0.003 - time) * 85;
          x === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
        }
        context.stroke();
      }
      heroFrame = requestAnimationFrame(draw);
      return;
    }

    context.fillStyle = 'rgba(3, 6, 4, 0.105)';
    context.fillRect(0, 0, width, height);
    context.font = `600 ${size}px Onest, monospace`;
    for (let i = 0; i < columns; i += 1) {
      const hot = Math.random() > 0.965;
      context.fillStyle = hot ? '#d6ffdc' : `rgba(82, 255, 113, ${0.3 + Math.random() * 0.55})`;
      context.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, drops[i] * size);
      if (drops[i] * size > height && Math.random() > 0.976) drops[i] = Math.random() * -28;
      drops[i] += 0.42 + Math.random() * 0.18;
    }
    heroFrame = requestAnimationFrame(draw);
  }
  cancelAnimationFrame(heroFrame);
  draw();
}

function buildForeground() {
  foreground.replaceChildren();
  const words = activeHero === 'code' ? ['01', '10', 'BUILD', 'VIBE', '{}', 'PUBLIC', '↗', 'USER'] : activeHero === 'quantum' ? ['IDEA', 'FIELD', 'VIBE', 'LINK', '↗'] : ['LIGHT', 'PROJECT', '01', 'SIGNAL', '↗'];
  const count = mobile.matches ? 9 : 18;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = `code-particle${i % 5 === 0 ? ' is-hot' : ''}`;
    particle.textContent = words[i % words.length];
    particle.style.left = `${activeHero === 'singularity' ? 62 + Math.random() * 22 : 42 + Math.random() * 48}%`;
    particle.style.top = `${15 + Math.random() * 70}%`;
    particle.style.setProperty('--tx', `${(Math.random() - 0.3) * 300}px`);
    particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 220}px`);
    particle.style.setProperty('--duration', `${5.5 + Math.random() * 5}s`);
    particle.style.setProperty('--delay', `${Math.random() * -9}s`);
    foreground.append(particle);
  }
}

function updateHeroMotion() {
  if (reducedMotion.matches) {
    cancelAnimationFrame(heroFrame);
    foreground.replaceChildren();
    return;
  }
  startHeroCanvas();
  buildForeground();
}

updateHeroMotion();
reducedMotion.addEventListener('change', updateHeroMotion);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateHeroMotion, 180);
});
