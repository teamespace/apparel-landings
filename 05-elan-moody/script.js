(function () {
  'use strict';

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('elan-theme');
  if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? '' : 'light';
      if (next) document.documentElement.setAttribute('data-theme', next);
      else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('elan-theme', next || 'dark');
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  revealEls.forEach(el => observer.observe(el));

  // Runway drag-to-scroll
  const runway = document.getElementById('runway-scroll');
  if (runway) {
    let isDown = false, startX, scrollLeft;
    runway.addEventListener('mousedown', (e) => {
      isDown = true; runway.classList.add('is-dragging');
      startX = e.pageX - runway.offsetLeft; scrollLeft = runway.scrollLeft;
    });
    runway.addEventListener('mouseleave', () => { isDown = false; runway.classList.remove('is-dragging'); });
    runway.addEventListener('mouseup', () => { isDown = false; runway.classList.remove('is-dragging'); });
    runway.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - runway.offsetLeft;
      runway.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  // Film play button stub
  const playBtn = document.querySelector('.film-strip__play');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      playBtn.innerHTML = '<span style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;">Coming soon</span>';
      setTimeout(() => {
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor"><path d="M234,113.58,53.67,20.81A16,16,0,0,0,32.43,36.82v182.3a16,16,0,0,0,21.24,15l180.33-92.77A16,16,0,0,0,234,113.58Z"></path></svg>';
      }, 1500);
    });
  }
})();
