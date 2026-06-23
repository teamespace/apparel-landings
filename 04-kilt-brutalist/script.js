// ponytail: in-memory cart only; persist if checkout ever becomes real
const products = [
  {
    id: 'p1',
    name: 'Raw Cut Bomber',
    price: 245,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    alt: 'Black and white portrait of a model in a structured jacket'
  },
  {
    id: 'p2',
    name: 'Concrete Trench',
    price: 320,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    alt: 'Editorial fashion shot of a long coat in monochrome'
  },
  {
    id: 'p3',
    name: 'Utility Vest',
    price: 185,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    alt: 'Stark black and white streetwear editorial'
  },
  {
    id: 'p4',
    name: 'Asymmetric Hoodie',
    price: 160,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    alt: 'Model wearing an oversized hoodie in high contrast lighting'
  },
  {
    id: 'p5',
    name: 'Heavyweight Tee',
    price: 95,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    alt: 'Minimal editorial t-shirt shot in black and white'
  },
  {
    id: 'p6',
    name: 'Panelled Pant',
    price: 210,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    alt: 'Full body monochrome fashion editorial with wide leg trousers'
  }
];

const sizes = ['S', 'M', 'L', 'XL'];
let cart = [];

const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBody = document.getElementById('cart-body');
const cartBadge = document.getElementById('cart-badge');
const cartTotal = document.getElementById('cart-total');
const cartToggle = document.querySelector('.cart-toggle');
const cartClose = document.querySelector('.cart-close');
const checkoutBtn = document.getElementById('checkout-btn');
const signupForm = document.getElementById('signup-form');
const playBtn = document.getElementById('play-btn');

function formatMoney(amount) {
  return '$' + amount.toFixed(2);
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      </div>
      <div class="product-meta">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatMoney(product.price)}</p>
        <div class="size-picker" role="group" aria-label="Select size for ${product.name}">
          ${sizes.map((size, i) => `
            <label>
              <input type="radio" name="size-${product.id}" value="${size}" ${i === 1 ? 'checked' : ''} />
              <span>${size}</span>
            </label>
          `).join('')}
        </div>
        <button class="add-to-cart" data-id="${product.id}">ADD TO CART</button>
      </div>
    </article>
  `).join('');
}

function getSelectedSize(productId) {
  const input = document.querySelector(`input[name="size-${productId}"]:checked`);
  return input ? input.value : 'M';
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const size = getSelectedSize(productId);
  const existing = cart.find(item => item.id === productId && item.size === size);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key: `${productId}-${size}`,
      id: productId,
      name: product.name,
      price: product.price,
      size,
      qty: 1,
      image: product.image,
      alt: product.alt
    });
  }

  updateCart();
  openCart();
}

function removeFromCart(key) {
  cart = cart.filter(item => item.key !== key);
  updateCart();
}

function changeQty(key, delta) {
  const item = cart.find(item => item.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(key);
  } else {
    updateCart();
  }
}

function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getTotalPrice() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCart() {
  cartBadge.textContent = getTotalItems();
  cartTotal.textContent = formatMoney(getTotalPrice());

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <img src="${item.image}" alt="${item.alt}" />
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>SIZE ${item.size} — ${formatMoney(item.price)}</p>
        <div class="cart-item-qty">
          <button class="qty-dec" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button class="qty-inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item-remove" aria-label="Remove ${item.name} size ${item.size}">REMOVE</button>
    </div>
  `).join('');
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.hidden = false;
  cartToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.hidden = true;
  cartToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

productGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    addToCart(e.target.dataset.id);
  }
});

cartBody.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item');
  if (!item) return;
  const key = item.dataset.key;

  if (e.target.classList.contains('qty-dec')) {
    changeQty(key, -1);
  } else if (e.target.classList.contains('qty-inc')) {
    changeQty(key, 1);
  } else if (e.target.classList.contains('cart-item-remove')) {
    removeFromCart(key);
  }
});

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartDrawer.classList.contains('open')) {
    closeCart();
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  alert('Checkout is simulated. Your total: ' + formatMoney(getTotalPrice()));
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm.email.value.trim();
  if (!email) return;
  alert('Subscribed: ' + email);
  signupForm.reset();
});

playBtn.addEventListener('click', () => {
  playBtn.classList.toggle('playing');
  playBtn.setAttribute('aria-label', playBtn.classList.contains('playing') ? 'Pause campaign video' : 'Play campaign video');
});

renderProducts();
updateCart();

// Scroll-reveal animation for .reveal sections
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Header scroll behavior: sticky black background after hero
const header = document.querySelector('.site-header') || document.querySelector('header');
const hero = document.querySelector('.hero-split');
if (header && hero) {
  const onScroll = () => {
    const pastHero = window.scrollY > hero.offsetHeight - header.offsetHeight;
    header.classList.toggle('scrolled', pastHero);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Marquee pause-on-hover
const marquee = document.querySelector('.marquee-track') || document.querySelector('.marquee');
if (marquee) {
  const parent = marquee.parentElement;
  parent.addEventListener('mouseenter', () => { marquee.style.animationPlayState = 'paused'; });
  parent.addEventListener('mouseleave', () => { marquee.style.animationPlayState = ''; });
}
