(function () {
  const wrap = document.querySelector('.v-scroll-wrap');
  const sections = Array.from(document.querySelectorAll('.panel'));
  if (!wrap || sections.length <= 1) return;

  let current = 0;
  let animating = false;

  function goTo(index) {
    if (index < 0 || index >= sections.length) return;
    current = index;
    animating = true;
    wrap.style.transform = `translateY(calc(-${current} * 100vh))`;
    setTimeout(() => { animating = false; }, 350);
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (animating) return;
    if (e.deltaY > 0) goTo(current + 1);
    else if (e.deltaY < 0) goTo(current - 1);
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (animating) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 30) return;
    if (diff > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      const idx = sections.indexOf(target);
      if (idx === -1) return;
      e.preventDefault();
      goTo(idx);
    });
  });

  document.querySelectorAll('.side-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const hash = new URL(link.href).hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      const idx = sections.indexOf(target);
      if (idx !== -1) goTo(idx);
    });
  });

  function jumpToHash() {
    const hash = location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const idx = sections.indexOf(target);
    if (idx !== -1) { current = idx; wrap.style.transform = `translateY(calc(-${current} * 100vh))`; }
  }
  jumpToHash();
})();
