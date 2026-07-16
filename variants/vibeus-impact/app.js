(() => {
  const header = document.querySelector('[data-header]');
  const heroVideo = document.querySelector('[data-hero-video]');
  const launchVideo = document.querySelector('[data-launch-video]');
  const stage = document.querySelector('[data-impact-stage]');
  const label = document.querySelector('[data-impact-label]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const labels = [
    'КОНТЕКСТ НАЙДЕН',
    'РАБОЧИЙ ПУТЬ СОХРАНЁН',
    'РЕШЕНИЕ В ОБЩЕМ КОНТУРЕ',
    'СЛЕДУЮЩИЙ НАЧНЁТ ДАЛЬШЕ'
  ];
  let impactIndex = 0;
  let lastImpactAt = -10;
  let impactTimer;
  let launchHasStarted = false;

  const triggerImpact = () => {
    if (!stage || reduceMotion.matches) return;
    stage.classList.remove('is-impacting');
    void stage.offsetWidth;
    stage.classList.add('is-impacting');
    label.textContent = labels[impactIndex % labels.length];
    impactIndex += 1;
    clearTimeout(impactTimer);
    impactTimer = window.setTimeout(() => {
      stage.classList.remove('is-impacting');
      label.textContent = 'ПОПЫТКА ДВИЖЕТСЯ К ПРЕДЕЛУ';
    }, 2400);
  };

  const syncImpactToVideo = () => {
    if (!heroVideo.duration || reduceMotion.matches) return;
    const phase = heroVideo.currentTime / heroVideo.duration;
    const nearImpact = (phase > .18 && phase < .22) || (phase > .52 && phase < .56) || (phase > .84 && phase < .88);
    if (nearImpact && heroVideo.currentTime - lastImpactAt > 1.6) {
      lastImpactAt = heroVideo.currentTime;
      triggerImpact();
    }
    if (heroVideo.currentTime < .4) lastImpactAt = -10;
  };

  const applyMotionPreference = () => {
    if (reduceMotion.matches) {
      heroVideo?.pause();
      launchVideo?.pause();
      return;
    }
    heroVideo?.play().catch(() => {});
    if (launchHasStarted) launchVideo?.play().catch(() => {});
  };

  heroVideo?.addEventListener('timeupdate', syncImpactToVideo);
  heroVideo?.addEventListener('error', () => { label.textContent = 'ВИДЕО НЕДОСТУПНО — СМЫСЛ СОХРАНЁН'; });

  if (launchVideo && 'IntersectionObserver' in window) {
    launchVideo.pause();
    const launchObserver = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting;
      if (visible && !reduceMotion.matches) {
        if (!launchHasStarted) {
          launchVideo.currentTime = 0;
          launchHasStarted = true;
        }
        launchVideo.play().catch(() => {});
      } else {
        launchVideo.pause();
      }
    }, { threshold: .35 });
    launchObserver.observe(launchVideo);
  }

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  reduceMotion.addEventListener?.('change', applyMotionPreference);
  applyMotionPreference();
})();
