(function () {
  'use strict';

  const products = [
    { id: 1, name: 'Linen Trench', price: 340, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], selected: 'S' },
    { id: 2, name: 'Cashmere Knit', price: 260, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], selected: 'S' },
    { id: 3, name: 'Wide-Leg Trousers', price: 195, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], selected: 'M' },
    { id: 4, name: 'Silk Blouse', price: 225, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], selected: 'S' },
    { id: 5, name: 'Merino Scarf', price: 95, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80', sizes: ['One Size'], selected: 'One Size' },
    { id: 6, name: 'Tailored Blazer', price: 420, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], selected: 'S' }
  ];

  let bagCount = 0;

  // Utility bar
  const utilityBar = document.getElementById('utility-bar');
  const utilityClose = document.getElementById('utility-close');
  if (utilityClose && utilityBar) {
    utilityClose.addEventListener('click', () => utilityBar.classList.add('is-hidden'));
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('arlo-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? '' : 'dark';
      if (next) document.documentElement.setAttribute('data-theme', next);
      else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('arlo-theme', next);
    });
  }

  // Drawer
  const drawer = document.getElementById('product-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const drawerGrid = document.getElementById('drawer-grid');
  const bagCountEl = document.getElementById('bag-count');

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-visible');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-visible');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderDrawer() {
    if (!drawerGrid) return;
    drawerGrid.innerHTML = products.map(p => `
      <article class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p class="product-price">$${p.price}</p>
        <div class="size-picker" role="group" aria-label="Select size for ${p.name}">
          ${p.sizes.map(s => `<button type="button" data-size="${s}" aria-pressed="${s === p.selected}">${s}</button>`).join('')}
        </div>
        <button class="btn add-to-bag">Add to Bag</button>
      </article>
    `).join('');

    drawerGrid.querySelectorAll('.size-picker button').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.product-card');
        const id = Number(card.dataset.id);
        const size = this.dataset.size;
        const product = products.find(p => p.id === id);
        if (product) product.selected = size;
        card.querySelectorAll('.size-picker button').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    drawerGrid.querySelectorAll('.add-to-bag').forEach(btn => {
      btn.addEventListener('click', function () {
        bagCount++;
        if (bagCountEl) bagCountEl.textContent = bagCount;
        this.textContent = 'Added';
        this.classList.add('is-added');
        setTimeout(() => {
          this.textContent = 'Add to Bag';
          this.classList.remove('is-added');
        }, 1200);
      });
    });
  }

  document.querySelectorAll('#open-drawer, #hero-cta, #story-cta').forEach(btn => {
    if (btn) btn.addEventListener('click', openDrawer);
  });
  if (bagBtn) bagBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  renderDrawer();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.category-card, .feature-product, .lookbook__item, .craft__inner, .journal-card, .manifesto__inner');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
})();
