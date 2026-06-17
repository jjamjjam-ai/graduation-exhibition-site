(function () {
  const sections = Array.from(document.querySelectorAll('.panel'));
  if (sections.length <= 1) return;

  let current = 0;
  let animating = false;

  // 현재 보이는 섹션을 항상 추적
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        current = sections.indexOf(entry.target);
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => observer.observe(s));

  function goTo(index) {
    if (index < 0 || index >= sections.length) return;
    current = index;
    animating = true;
    sections[current].scrollIntoView({ behavior: 'smooth' });
    if (sections[current].id) history.replaceState(null, '', `#${sections[current].id}`);
    setTimeout(() => { animating = false; }, 800);
  }

  // 앵커 클릭도 goTo()로 처리해 current 동기화
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

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (animating) return;
    if (e.deltaY > 0) goTo(current + 1);
    else if (e.deltaY < 0) goTo(current - 1);
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (animating) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 30) return;
    if (diff > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // 해시로 직접 진입 시
  function jumpToHash() {
    const hash = location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const idx = sections.indexOf(target);
    if (idx !== -1) { current = idx; sections[idx].scrollIntoView(); }
  }
  jumpToHash();
})();
