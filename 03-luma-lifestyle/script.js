const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const products = [
  {
    id: 1,
    name: 'Cotton Tennis Sweater',
    price: 98,
    image1: '/generated-assets/luma/luma-product-1a.png?v=3',
    image2: '/generated-assets/luma/luma-product-1b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-1.png?v=3',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#f5f0e6', '#1a2744', '#8b9a6d']
  },
  {
    id: 2,
    name: 'Pleated Linen Trouser',
    price: 128,
    image1: '/generated-assets/luma/luma-product-2a.png?v=3',
    image2: '/generated-assets/luma/luma-product-2b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-2.png?v=3',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#e8e0d5', '#3d4a3a', '#722f37']
  },
  {
    id: 3,
    name: 'Cable Knit Vest',
    price: 110,
    image1: '/generated-assets/luma/luma-product-3a.png?v=3',
    image2: '/generated-assets/luma/luma-product-3b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-3.png?v=3',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f4f1ea', '#2c3e50', '#a98c7b']
  },
  {
    id: 4,
    name: 'Silk Club Bandana',
    price: 48,
    image1: '/generated-assets/luma/luma-product-4a.png?v=3',
    image2: '/generated-assets/luma/luma-product-4b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-4.png?v=3',
    sizes: ['One Size'],
    colors: ['#faf8f3', '#1f2d3d', '#6b7c4e', '#d4c5b5']
  },
  {
    id: 5,
    name: 'Relaxed Knit Polo',
    price: 88,
    image1: '/generated-assets/luma/luma-product-5a.png?v=3',
    image2: '/generated-assets/luma/luma-product-5b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-5.png?v=3',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#efebe4', '#273043', '#556b2f']
  },
  {
    id: 6,
    name: 'Vintage Cardigan',
    price: 145,
    image1: '/generated-assets/luma/luma-product-6a.png?v=3',
    image2: '/generated-assets/luma/luma-product-6b.png?v=3',
    showcaseImage: '/generated-assets/luma/luma-showcase-6.png?v=3',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f7f5ef', '#24344d', '#7a8450', '#c9b8a8']
  }
];

const cart = [];

function formatPrice(n) {
  return '$' + n.toFixed(2);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = $('#cart-badge') || $('.cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.setAttribute('data-count', count);
  }
}

function addToCart(product, size) {
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image1: product.image1, size, qty: 1 });
  }
  updateCartCount();
  renderCart();
}

function removeFromCart(id, size) {
  const idx = cart.findIndex(i => i.id === id && i.size === size);
  if (idx > -1) cart.splice(idx, 1);
  updateCartCount();
  renderCart();
}

function updateQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, size);
  else {
    updateCartCount();
    renderCart();
  }
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartDrawer() {
  return $('#cart-drawer') || $('.cart-drawer');
}

function getCartToggle() {
  return $('#cart-toggle') || $('.cart-toggle');
}

function renderCart() {
  const drawer = getCartDrawer();
  if (!drawer) return;
  const list = drawer.querySelector('.cart-list');
  const totalEl = drawer.querySelector('.cart-total__price');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
        <img src="${item.image1}" alt="${item.name}" loading="lazy">
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__meta">${item.size} &middot; ${formatPrice(item.price)}</p>
          <div class="cart-item__qty">
            <button class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item__remove" aria-label="Remove item">&times;</button>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = formatPrice(cartSubtotal());

  list.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn.closest('.cart-item');
      updateQty(Number(el.dataset.id), el.dataset.size, -1);
    });
  });
  list.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn.closest('.cart-item');
      updateQty(Number(el.dataset.id), el.dataset.size, 1);
    });
  });
  list.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn.closest('.cart-item');
      removeFromCart(Number(el.dataset.id), el.dataset.size);
    });
  });
}

let scrollLockPadding = 0;
function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = scrollbarWidth + 'px';
    scrollLockPadding = scrollbarWidth;
  }
}
function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  scrollLockPadding = 0;
}

function openCart() {
  const drawer = getCartDrawer();
  if (!drawer) return;
  renderCart();
  drawer.hidden = false;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  const toggle = getCartToggle();
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  lockScroll();
}

function closeCart() {
  const drawer = getCartDrawer();
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  setTimeout(() => { drawer.hidden = true; }, 300);
  const toggle = getCartToggle();
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

function initCartDrawer() {
  const drawer = getCartDrawer();
  if (!drawer) return;

  const overlay = drawer.querySelector('.cart-drawer__overlay');
  const closeBtn = drawer.querySelector('.cart-drawer__close');
  if (overlay) overlay.addEventListener('click', closeCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  const toggle = getCartToggle();
  if (toggle) toggle.addEventListener('click', openCart);
}

function renderProducts() {
  const container = $('#product-scroll') || $('.product-scroll') || $('#product-grid');
  if (!container) return;
  container.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Open quick view for ${p.name}">
      <div class="product-card__images">
        <img class="product-card__img product-card__img--primary" src="${p.image1}" alt="${p.name}" loading="lazy">
        <img class="product-card__img product-card__img--secondary" src="${p.image2}" alt="${p.name} alternate view" loading="lazy">
      </div>
      <div class="product-card__meta">
        <h3>${p.name}</h3>
        <p>${formatPrice(p.price)}</p>
      </div>
    </article>
  `).join('');
}

function renderShowcase() {
  const container = $('#showcase-grid');
  if (!container) return;
  container.innerHTML = products.map(p => `
    <article class="showcase-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Open quick view for ${p.name}">
      <div class="showcase-card__media">
        <img src="${p.showcaseImage}" alt="${p.name}" loading="lazy">
      </div>
      <div class="showcase-card__colors">
        ${p.colors.map(c => `<span class="showcase-card__color" style="background-color: ${c};" aria-hidden="true"></span>`).join('')}
      </div>
      <div class="showcase-card__meta">
        <h3>${p.name}</h3>
        <p>${formatPrice(p.price)}</p>
      </div>
    </article>
  `).join('');
}

function openQuickView(product) {
  const modal = $('#quick-view');
  const modalImg = $('#modal-img');
  const modalTitle = $('#modal-title');
  const modalPrice = $('#modal-price');
  const modalDesc = $('#modal-desc');
  const modalSizes = $('#modal-sizes');
  const addToBag = $('#add-to-bag');
  if (!modal || !modalImg || !modalTitle || !modalPrice || !modalSizes || !addToBag) return;

  modalImg.src = product.image1;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  if (modalDesc) modalDesc.textContent = '';

  modalSizes.innerHTML = product.sizes.map((size, i) => `
    <div class="size-option">
      <input type="radio" name="size" id="size-${size}" value="${size}" ${i === 0 ? 'checked' : ''}>
      <label for="size-${size}">${size}</label>
    </div>
  `).join('');

  addToBag.textContent = 'Add to Bag';
  addToBag.disabled = false;
  addToBag.onclick = () => {
    const selected = modalSizes.querySelector('input[name="size"]:checked');
    addToCart(product, selected ? selected.value : product.sizes[0]);
    addToBag.textContent = 'Added';
    addToBag.disabled = true;
    setTimeout(() => {
      addToBag.textContent = 'Add to Bag';
      addToBag.disabled = false;
    }, 1200);
  };

  modal.hidden = false;
  lockScroll();
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeQuickView() {
  const modal = $('#quick-view');
  if (!modal) return;
  modal.hidden = true;
  unlockScroll();
}

function initQuickView() {
  const container = $('#product-scroll') || $('.product-scroll') || $('#product-grid');
  if (container) {
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const product = products.find(p => p.id === Number(card.dataset.id));
      if (product) openQuickView(product);
    });
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.product-card');
        if (!card) return;
        e.preventDefault();
        const product = products.find(p => p.id === Number(card.dataset.id));
        if (product) openQuickView(product);
      }
    });
  }

  const modal = $('#quick-view');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeQuickView();
    });
  }
}

function initProductHover() {
  $$('.product-card').forEach(card => {
    const images = card.querySelectorAll('.product-card__img');
    if (images.length < 2) return;
    const primary = images[0];
    const secondary = images[1];
    if (prefersReducedMotion) {
      primary.style.transition = 'none';
      secondary.style.transition = 'none';
    }
    card.addEventListener('mouseenter', () => {
      primary.style.opacity = '0';
      secondary.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      primary.style.opacity = '1';
      secondary.style.opacity = '0';
    });
  });
}

function initAnnouncementBar() {
  const bar = $('.announcement-bar');
  if (!bar) return;
  const messages = $$('.announcement-bar__message', bar);
  if (messages.length < 2) return;

  let index = messages.findIndex(m => m.classList.contains('is-active'));
  if (index < 0) {
    index = 0;
    messages.forEach((m, i) => m.classList.toggle('is-active', i === 0));
  }

  const rotate = () => {
    messages[index].classList.remove('is-active');
    index = (index + 1) % messages.length;
    messages[index].classList.add('is-active');
  };

  const interval = setInterval(rotate, 4000);

  const close = $('#announcement-close') || $('.announcement-bar__close', bar);
  if (close) {
    close.addEventListener('click', () => {
      clearInterval(interval);
      bar.style.display = 'none';
    });
  }
}

function initHeaderScroll() {
  const header = $('.site-header');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('site-header--sticky', y > 20);
    if (y > lastY && y > 80) header.classList.add('site-header--hidden');
    else header.classList.remove('site-header--hidden');
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

function initHeroCarousel() {
  const hero = $('.hero');
  const slides = $$('.hero__slide');
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  // Normalize HTML .active to CSS .is-active.
  slides.forEach((slide, i) => {
    if (slide.classList.contains('active')) current = i;
    slide.classList.remove('active');
    slide.classList.toggle('is-active', i === current);
  });

  const pagination = $('.hero__pagination') || hero;
  const dots = $$('.hero__dot', pagination);

  dots.forEach((dot, i) => {
    if (dot.classList.contains('active')) current = i;
    dot.classList.remove('active');
    dot.classList.toggle('is-active', i === current);
    dot.setAttribute('aria-selected', String(i === current));
  });

  const setSlide = (next) => {
    if (next === current) return;
    slides[current].classList.remove('is-active');
    slides[next].classList.add('is-active');
    if (dots[current]) {
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
    }
    if (dots[next]) {
      dots[next].classList.add('is-active');
      dots[next].setAttribute('aria-selected', 'true');
    }
    current = next;
  };

  const nextSlide = () => setSlide((current + 1) % slides.length);

  if (pagination) {
    pagination.addEventListener('click', (e) => {
      const dot = e.target.closest('.hero__dot');
      if (!dot) return;
      const idx = Number(dot.dataset.slide ?? dot.dataset.index);
      if (!Number.isNaN(idx)) {
        setSlide(idx);
        resetTimer();
      }
    });
  }

  const startTimer = () => { if (!prefersReducedMotion) timer = setInterval(nextSlide, 5000); };
  const stopTimer = () => clearInterval(timer);
  const resetTimer = () => { stopTimer(); startTimer(); };

  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    hero.addEventListener('touchstart', stopTimer, { passive: true });
    hero.addEventListener('touchend', () => setTimeout(startTimer, 3000), { passive: true });
  }
  startTimer();
}

function initCategoryTabs() {
  const tabs = $$('.category-tab');
  const grids = $$('.category-grid');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('active', 'is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active', 'is-active');
      tab.setAttribute('aria-selected', 'true');
      grids.forEach(grid => {
        grid.hidden = grid.id !== `grid-${category}`;
      });
    });
  });
}

function initFadeIn() {
  const fadeEls = $$('.fade-in');
  if (!fadeEls.length) return;

  if (prefersReducedMotion) {
    fadeEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}

function openMobileMenu() {
  const menu = $('#mobile-menu') || $('.mobile-menu');
  const toggle = $('#nav-toggle') || $('.mobile-menu__toggle');
  if (menu) {
    menu.hidden = false;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
  }
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  lockScroll();
}

function closeMobileMenu() {
  const menu = $('#mobile-menu') || $('.mobile-menu');
  const toggle = $('#nav-toggle') || $('.mobile-menu__toggle');
  if (menu) {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    setTimeout(() => { menu.hidden = true; }, 300);
  }
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

function initMobileMenu() {
  const toggle = $('#nav-toggle') || $('.mobile-menu__toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const menu = $('#mobile-menu') || $('.mobile-menu');
    const isOpen = menu ? menu.classList.contains('is-open') : false;
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  const menu = $('#mobile-menu') || $('.mobile-menu');
  if (menu) {
    const overlay = menu.querySelector('.mobile-menu__overlay');
    const closeBtn = menu.querySelector('.mobile-menu__close');
    if (overlay) overlay.addEventListener('click', closeMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

    const panel = menu.querySelector('.mobile-menu__panel') || menu;
    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMobileMenu());
    });
  }

  $$('.accordion__trigger').forEach(trigger => {
    const controls = trigger.getAttribute('aria-controls');
    const content = controls ? document.getElementById(controls) : null;
    if (!content) return;
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      content.hidden = expanded;
    });
  });
}

function initNewsletter() {
  const toggle = $('#newsletter-toggle');
  const wrapper = $('#newsletter-form-wrapper');
  if (toggle && wrapper) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      wrapper.hidden = expanded;
      if (!expanded) {
        setTimeout(() => wrapper.querySelector('input')?.focus(), 100);
      }
    });
  }

  const form = $('#newsletter-form');
  const note = $('#form-note');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Thank you for subscribing to LUMA.';
      form.reset();
      if (wrapper) wrapper.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const drawer = getCartDrawer();
    if (drawer && drawer.classList.contains('is-open')) closeCart();
    const mobileMenu = $('#mobile-menu') || $('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMobileMenu();
    const modal = $('#quick-view');
    if (modal && !modal.hidden) closeQuickView();
  }
});

function initShowcase() {
  const container = $('#showcase-grid');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.showcase-card');
    if (!card) return;
    const product = products.find(p => p.id === Number(card.dataset.id));
    if (product) openQuickView(product);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.showcase-card');
      if (!card) return;
      e.preventDefault();
      const product = products.find(p => p.id === Number(card.dataset.id));
      if (product) openQuickView(product);
    }
  });
}

function initShowcaseSlider() {
  const grid = $('#showcase-grid');
  const prev = $('#showcase-prev');
  const next = $('#showcase-next');
  if (!grid || !prev || !next) return;

  const getScrollStep = () => {
    const card = grid.querySelector('.showcase-card');
    const gap = parseInt(getComputedStyle(grid).gap || '0', 10) || 0;
    return card ? card.offsetWidth + gap : grid.clientWidth;
  };

  const scrollBy = (direction) => {
    const step = getScrollStep();
    grid.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  prev.addEventListener('click', () => scrollBy(-1));
  next.addEventListener('click', () => scrollBy(1));
}

function initCategoryMarquee() {
  const track = $('#category-track');
  if (!track) return;
  const originalTiles = Array.from(track.children);
  if (!originalTiles.length) return;
  // Clone original tiles for seamless infinite loop
  originalTiles.forEach(tile => {
    const clone = tile.cloneNode(true);
    clone.removeAttribute('id');
    track.appendChild(clone);
  });
}

function initFeaturedSlider() {
  const mainImg = $('#featured-main-img');
  const thumbs = $$('.featured-split__thumb');
  const counter = $('#featured-counter');
  if (!mainImg || !thumbs.length || !counter) return;

  const update = (index) => {
    const thumb = thumbs[index];
    if (!thumb) return;
    const newSrc = thumb.querySelector('img')?.src;
    if (!newSrc) return;
    mainImg.src = newSrc;
    mainImg.alt = thumb.getAttribute('aria-label') || 'Featured image';
    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    counter.textContent = `${index + 1} / ${thumbs.length}`;
  };

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => update(i));
  });
}

function init() {
  renderProducts();
  renderShowcase();
  initProductHover();
  initAnnouncementBar();
  initHeaderScroll();
  initHeroCarousel();
  initCategoryTabs();
  initFadeIn();
  initMobileMenu();
  initNewsletter();
  initCartDrawer();
  initQuickView();
  initShowcase();
  initShowcaseSlider();
  initCategoryMarquee();
  initFeaturedSlider();
  updateCartCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
