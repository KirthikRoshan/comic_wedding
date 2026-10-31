(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const petalLayer = byId('petal-layer');
  const petals = ['🌸', '🌼', '🌺', '💮', '✿'];
  let toastTimer;

  function toast(message) {
    const element = byId('toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('show'), 2600);
  }

  function shower(count = 25) {
    if (reducedMotion) {
      toast('A little flower shower just for you! 🌸');
      return;
    }
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.setProperty('--x', `${Math.random() * 100}%`);
      petal.style.setProperty('--size', `${15 + Math.random() * 20}px`);
      petal.style.setProperty('--time', `${2.4 + Math.random() * 2.1}s`);
      petal.style.setProperty('--sway', `${-120 + Math.random() * 240}px`);
      petal.style.animationDelay = `${Math.random() * 0.75}s`;
      petalLayer.appendChild(petal);
      setTimeout(() => petal.remove(), 5400);
    }
  }

  const flowerButton = byId('hero-flower-button');
  flowerButton.addEventListener('click', () => {
    shower(32);
    byId('couple-bubble').textContent = ['Yay! You made our day! ♡', 'Aww! More flowers! 🌸', 'We can\'t wait to see you! ✨'][Math.floor(Math.random() * 3)];
    const couple = document.querySelector('.hero-couple');
    couple.classList.remove('celebrate');
    // Restart the tiny happy wiggle on each click.
    void couple.offsetWidth;
    couple.classList.add('celebrate');
    setTimeout(() => couple.classList.remove('celebrate'), 850);
  });

  let wishes = 0;
  byId('blessing-button').addEventListener('click', () => {
    shower(42);
    wishes++;
    byId('blessing-status').textContent = wishes === 1
      ? 'Blessings received with so much love! 💕'
      : `${wishes} showers of love — our hearts are overflowing! 💕`;
  });

  const weddingMoment = new Date('2026-11-16T05:45:00+05:30').getTime();
  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((weddingMoment - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor((remaining % 86400) / 3600),
      minutes: Math.floor((remaining % 3600) / 60),
      seconds: remaining % 60
    };
    Object.entries(values).forEach(([id, value]) => {
      byId(id).textContent = id === 'days' ? String(value) : String(value).padStart(2, '0');
    });
    if (remaining === 0) {
      byId('blessing-status').textContent = 'Our forever has begun! Thank you for celebrating with us. ❤️';
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const address = 'Swarna Mahal, Covai to Salem NH Road, Chengappalli, Tiruppur, Tamil Nadu, India';
  byId('copy-address').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast('Venue address copied! 📍');
    } catch {
      toast('Select the address above to copy it.');
    }
  });

  const shareUrl = new URL(window.location.pathname, window.location.origin).href;
  const shareMessage = `One hello, two countries, and a love story that began before we ever met! 💍💕 Kirthik & Nikkila invite you to our wedding at Swarna Mahal, Chengappalli: Reception Nov 15, 2026 (6:30–9 PM IST), Muhurtham Nov 16 (5:45–7 AM IST). Read our anime comic invitation: ${shareUrl}`;
  byId('share-whatsapp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach((element) => observer.observe(element));
  }
})();
