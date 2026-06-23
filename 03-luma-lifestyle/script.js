const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const products = [
  {
    id: 1,
    name: 'Linen Everyday Shirt',
    price: 89,
    image1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Terracotta Wide Trousers',
    price: 112,
    image1: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 3,
    name: 'Sage Knit Cardigan',
    price: 128,
    image1: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 4,
    name: 'Dusty Blush Scarf',
    price: 54,
    image1: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    sizes: ['One Size']
  },
  {
    id: 5,
    name: 'Cotton Relaxed Tee',
    price: 48,
    image1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 6,
    name: 'Merino Wool Sweater',
    price: 145,
    image1: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

const cart = [];

function formatPrice(n) {
  return '$' + n.toFixed(2);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = $('.cart-badge') || $('#cart-count');
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
  let drawer = $('.cart-drawer');
  if (drawer) {
    const overlay = drawer.querySelector('.cart-drawer__overlay');
    const closeBtn = drawer.querySelector('.cart-drawer__close');
    if (overlay && !overlay.dataset.inited) {
      overlay.addEventListener('click', closeCart);
      overlay.dataset.inited = 'true';
    }
    if (closeBtn && !closeBtn.dataset.inited) {
      closeBtn.addEventListener('click', closeCart);
      closeBtn.dataset.inited = 'true';
    }
    return drawer;
  }

  drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-drawer__overlay"></div>
    <div class="cart-drawer__panel">
      <div class="cart-drawer__header">
        <h2>Your Cart</h2>
        <button class="cart-drawer__close" aria-label="Close cart">&times;</button>
      </div>
      <div class="cart-list"></div>
      <div class="cart-drawer__footer">
        <p class="cart-total">Subtotal: <span>$0.00</span></p>
        <button class="btn btn--wide checkout-btn">Checkout</button>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  const overlay = drawer.querySelector('.cart-drawer__overlay');
  const closeBtn = drawer.querySelector('.cart-drawer__close');
  if (overlay) overlay.addEventListener('click', closeCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  return drawer;
}

function renderCart() {
  const drawer = getCartDrawer();
  const list = drawer.querySelector('.cart-list');
  const totalEl = drawer.querySelector('.cart-total__price') || drawer.querySelector('.cart-total span:last-child');
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
  renderCart();
  const drawer = getCartDrawer();
  drawer.hidden = false;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  lockScroll();
}

function closeCart() {
  const drawer = $('.cart-drawer');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  setTimeout(() => { drawer.hidden = true; }, 300);
  unlockScroll();
}

const cartToggle = $('.cart-toggle') || $('#cart-btn');
if (cartToggle) cartToggle.addEventListener('click', openCart);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const drawer = $('.cart-drawer');
    if (drawer && drawer.classList.contains('is-open')) closeCart();
    const mobileMenu = $('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('is-open')) closeMobileMenu();
  }
});

function renderProducts() {
  const container = $('#product-grid') || $('.product-scroll');
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

const grid = $('#product-grid') || $('.product-scroll');
if (grid) {
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const product = products.find(p => p.id === Number(card.dataset.id));
    if (product) openQuickView(product);
  });
  grid.addEventListener('keydown', (e) => {
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
    if (e.target.hasAttribute('data-close')) closeQuickView();
  });
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

  let index = 0;
  messages[index].classList.add('is-active');

  const rotate = () => {
    messages[index].classList.remove('is-active');
    index = (index + 1) % messages.length;
    messages[index].classList.add('is-active');
  };

  const interval = setInterval(rotate, 4000);

  const close = $('.announcement-bar__close', bar);
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
    header.classList.toggle('header--sticky', y > 20);
    if (y > lastY && y > 80) header.classList.add('header--hidden');
    else header.classList.remove('header--hidden');
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
  const reduced = prefersReducedMotion;

  const setSlide = (next) => {
    slides[current].classList.remove('is-active');
    slides[next].classList.add('is-active');
    current = next;
    updateDots();
  };

  const nextSlide = () => setSlide((current + 1) % slides.length);

  let pagination = $('.hero__pagination');
  if (!pagination) {
    pagination = document.createElement('div');
    pagination.className = 'hero__pagination';
    if (hero) hero.appendChild(pagination);
  }

  pagination.innerHTML = slides.map((_, i) => `
    <button class="hero__dot" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
  `).join('');

  const updateDots = () => {
    $$('.hero__dot', pagination).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  };

  pagination.addEventListener('click', (e) => {
    const dot = e.target.closest('.hero__dot');
    if (!dot) return;
    setSlide(Number(dot.dataset.index));
    resetTimer();
  });

  slides[0].classList.add('is-active');
  updateDots();

  const startTimer = () => { if (!reduced) timer = setInterval(nextSlide, 5000); };
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
  const cards = $$('.category-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const grids = $$('.category-grid');
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
  const menu = $('.mobile-menu') || $('#nav-menu');
  const toggle = $('.mobile-menu__toggle') || $('#nav-toggle');
  if (menu) {
    menu.hidden = false;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
  }
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  lockScroll();
}

function closeMobileMenu() {
  const menu = $('.mobile-menu') || $('#nav-menu');
  const toggle = $('.mobile-menu__toggle') || $('#nav-toggle');
  if (menu) {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    setTimeout(() => { menu.hidden = true; }, 300);
  }
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

function initMobileMenu() {
  const toggle = $('.mobile-menu__toggle') || $('#nav-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const menu = $('.mobile-menu') || $('#nav-menu');
    const isOpen = menu ? menu.classList.contains('is-open') : false;
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  const overlay = $('.mobile-menu__overlay');
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  const closeBtn = $('.mobile-menu__close');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  const panel = $('.mobile-menu__panel') || $('#nav-menu');
  if (panel) {
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
  const form = $('#newsletter-form');
  const note = $('#form-note');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Thank you for subscribing to LUMA.';
      form.reset();
    });
  }
}

function init() {
  renderProducts();
  initProductHover();
  initAnnouncementBar();
  initHeaderScroll();
  initHeroCarousel();
  initCategoryTabs();
  initFadeIn();
  initMobileMenu();
  initNewsletter();
  updateCartCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
