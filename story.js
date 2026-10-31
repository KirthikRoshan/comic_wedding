(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.getElementById('story-root');

  async function loadStory() {
    try {
      const response = await fetch('story-chapters.html', { cache: 'default' });
      if (!response.ok) throw new Error('Story chapter file could not be loaded');
      root.innerHTML = await response.text();
      setupReader();
    } catch {
      root.innerHTML = '<p class="story-fallback">On May 24, 2026, two people in Indianapolis and Tirupur said hello. They fell in love before they ever met. Soon, they will meet in person—and on November 16, their forever begins. ♡</p>';
    }
  }

  function heartBurst(element, count = 10) {
    const bounds = element.getBoundingClientRect();
    if (reducedMotion) {
      element.classList.add('loved');
      setTimeout(() => element.classList.remove('loved'), 400);
      return;
    }
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart-burst';
      heart.textContent = ['♥', '♡', '💕', '✦'][i % 4];
      heart.setAttribute('aria-hidden', 'true');
      heart.style.setProperty('--love-x', `${bounds.left + bounds.width / 2 + (Math.random() - 0.5) * 70}px`);
      heart.style.setProperty('--love-y', `${bounds.top + bounds.height / 2 + (Math.random() - 0.5) * 50}px`);
      heart.style.setProperty('--love-size', `${18 + Math.random() * 19}px`);
      heart.style.setProperty('--love-shift', `${(Math.random() - 0.5) * 160}px`);
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }
  }

  function setupReader() {
    const rail = document.getElementById('story-rail');
    const cards = [...rail.querySelectorAll('.story-card')];
    const dots = [...document.querySelectorAll('#story-dots button')];
    const prev = document.getElementById('story-prev');
    const next = document.getElementById('story-next');
    const position = document.getElementById('story-position');
    let current = 0;
    let raf = 0;

    function cardOffset(index) {
      return cards[index].getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
    }

    function update(index) {
      current = Math.max(0, Math.min(cards.length - 1, index));
      position.textContent = `SCENE ${String(current + 1).padStart(2, '0')} / 06`;
      prev.disabled = current === 0;
      next.disabled = current === cards.length - 1;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        if (i === current) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
    }

    function goTo(index) {
      const target = Math.max(0, Math.min(cards.length - 1, index));
      update(target);
      rail.scrollTo({ left: cardOffset(target), behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
    rail.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const closest = cards.reduce((best, card, index) => {
          const distance = Math.abs(cardOffset(index) - rail.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Number.POSITIVE_INFINITY });
        update(closest.index);
      });
    }, { passive: true });
    rail.addEventListener('keydown', (event) => {
      if (event.target !== rail) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1); }
    });
    update(0);

    root.querySelectorAll('[data-love]').forEach((button) => {
      button.addEventListener('click', () => heartBurst(button, 14));
    });
    root.querySelectorAll('.story-card-art img').forEach((image) => {
      image.addEventListener('click', () => heartBurst(image, 11));
    });

    const wakeButton = document.getElementById('wake-button');
    const sleepyImage = document.getElementById('sleepy-kirthik');
    const wakeText = document.getElementById('wake-response');
    let wakeCount = 0;
    wakeButton.addEventListener('click', () => {
      wakeCount++;
      const lines = [
        'Kirthik: “I’m awake! ...probably.” 😴',
        'Nikki: “You said that five minutes ago!” 😂',
        'Kirthik: “Okay okay! Good morning, Nikki!” ❤️'
      ];
      wakeText.textContent = lines[(wakeCount - 1) % lines.length];
      sleepyImage.classList.remove('awake');
      void sleepyImage.offsetWidth;
      sleepyImage.classList.add('awake');
      heartBurst(wakeButton, 8);
    });
  }

  loadStory();
})();
