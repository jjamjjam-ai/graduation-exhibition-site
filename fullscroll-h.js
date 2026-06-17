(function () {
  const wrap = document.querySelector('.h-scroll-wrap');
  const sections = Array.from(document.querySelectorAll('.panel'));
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');
  let current = 0;
  let animating = false;

  // 각 패널에 ID 자동 부여
  sections.forEach((s, i) => { if (!s.id) s.id = `page-${i + 1}`; });

  function goTo(index, updateHash = true) {
    if (index < 0 || index >= sections.length) return;
    current = index;
    animating = true;
    wrap.style.transform = `translateX(calc(-${current} * 100vw))`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === sections.length - 1;
    if (updateHash) history.replaceState(null, '', `#${sections[current].id}`);
    setTimeout(() => { animating = false; }, 350);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (animating) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 0) goTo(current + 1);
    else if (delta < 0) goTo(current - 1);
  }, { passive: false });

  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (animating) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    if (diff > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (animating) return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  function jumpToHash(hash) {
    if (!hash) return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    const idx = sections.indexOf(target);
    if (idx === -1) return false;
    goTo(idx, false);
    return true;
  }

  window.addEventListener('hashchange', () => jumpToHash(location.hash));

  if (!jumpToHash(location.hash)) goTo(0, false);
})();
