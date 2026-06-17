(function () {
  const TOTAL = 140;
  const pageSrc = (i) => `assets/source/pages/page_${i + 1}.png`;

  const track = document.querySelector('.h-track');
  const imgs = track.querySelectorAll('.slide-image');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');

  let current = 0;
  let animating = false;

  function render() {
    imgs[0].src = pageSrc(Math.max(0, current - 1));
    imgs[1].src = pageSrc(current);
    imgs[2].src = pageSrc(Math.min(TOTAL - 1, current + 1));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === TOTAL - 1;
  }

  function snapTo(index, updateHash = true) {
    if (index < 0 || index >= TOTAL) return;
    current = index;
    track.classList.remove('is-animating');
    track.style.transform = 'translateX(-100vw)';
    render();
    if (updateHash) history.replaceState(null, '', `#page-${current + 1}`);
  }

  function slide(direction) {
    if (animating) return;
    const newIndex = current + (direction === 'next' ? 1 : -1);
    if (newIndex < 0 || newIndex >= TOTAL) return;
    animating = true;
    track.classList.add('is-animating');
    track.style.transform = direction === 'next' ? 'translateX(-200vw)' : 'translateX(0vw)';
    setTimeout(() => {
      snapTo(newIndex);
      animating = false;
    }, 320);
  }

  prevBtn.addEventListener('click', () => slide('prev'));
  nextBtn.addEventListener('click', () => slide('next'));

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (animating) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 0) slide('next');
    else if (delta < 0) slide('prev');
  }, { passive: false });

  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (animating) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    slide(diff > 0 ? 'next' : 'prev');
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (animating) return;
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft') slide('prev');
  });

  function jumpToHash(hash) {
    if (!hash) return false;
    const match = hash.match(/^#page-(\d+)$/);
    if (!match) return false;
    const idx = parseInt(match[1], 10) - 1;
    if (idx < 0 || idx >= TOTAL) return false;
    snapTo(idx, false);
    return true;
  }

  window.addEventListener('hashchange', () => jumpToHash(location.hash));

  if (!jumpToHash(location.hash)) snapTo(0, false);
})();
