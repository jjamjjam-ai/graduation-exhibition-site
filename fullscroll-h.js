(function () {
  const wrap = document.querySelector('.h-scroll-wrap');
  const sections = Array.from(document.querySelectorAll('.panel'));
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');
  let current = 0;
  let animating = false;

  function goTo(index) {
    if (index < 0 || index >= sections.length) return;
    current = index;
    animating = true;
    wrap.style.transform = `translateX(calc(-${current} * 100vw))`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === sections.length - 1;
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

  goTo(0);
})();
