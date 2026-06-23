const products = [
  { id: 'p1', name: 'VOX BOMBER — BLACK', price: 189, image: 'https://images.unsplash.com/photo-1551488852-0801751ac367?w=800&q=80' },
  { id: 'p2', name: 'STENCIL HOODIE', price: 98, image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80' },
  { id: 'p3', name: 'TAG UTILITY PANT', price: 124, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa9b996?w=800&q=80' },
  { id: 'p4', name: 'DROP TEE / 07', price: 48, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  { id: 'p5', name: 'VOX BEANIE', price: 36, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80' },
  { id: 'p6', name: 'CARGO SHORT', price: 72, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80' },
];

const sizes = ['S', 'M', 'L', 'XL'];
let cart = [];

const productGrid = document.getElementById('productGrid');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const customCursor = document.getElementById('customCursor');
const cursorLabel = document.getElementById('cursorLabel');
const lookbookScroll = document.getElementById('lookbookScroll');

function initProducts() {
  productGrid.innerHTML = products.map(p => `
    <article class="product-card" data-cursor="Add">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">€${p.price}</p>
        <div class="size-picker" role="radiogroup" aria-label="Select size for ${p.name}">
          ${sizes.map((s, i) => `
            <label>
              <input type="radio" name="size-${p.id}" value="${s}" ${i === 1 ? 'checked' : ''} />
              <span>${s}</span>
            </label>
          `).join('')}
        </div>
        <button class="btn btn-primary add-to-cart" data-id="${p.id}" type="button">Add to Cart</button>
      </div>
    </article>
  `).join('');

  productGrid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const size = productGrid.querySelector(`input[name="size-${id}"]:checked`).value;
      addToCart(id, size);
    });
  });
}

function addToCart(id, size) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id && item.size === size);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, size, qty: 1, ...product });
  }
  updateCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartBadge.textContent = totalItems;
  cartBadge.setAttribute('aria-label', `${totalItems} items`);
  cartTotal.textContent = `€${total.toFixed(2)}`;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartList.style.display = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartList.style.display = 'flex';
    cartFooter.style.display = 'block';
    cartList.innerHTML = cart.map((item, i) => `
      <li class="cart-item">
        <img src="${item.image}" alt="" />
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="cart-item-meta">SIZE ${item.size} — €${item.price}</p>
          <div class="qty-control">
            <button type="button" data-action="dec" data-index="${i}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button type="button" data-action="inc" data-index="${i}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-btn" data-action="remove" data-index="${i}" type="button">Remove</button>
      </li>
    `).join('');

    cartList.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.index, 10);
        if (btn.dataset.action === 'remove') removeFromCart(i);
        else changeQty(i, btn.dataset.action === 'inc' ? 1 : -1);
      });
    });
  }
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  cartClose.focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  cartToggle.focus();
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  alert(`Checkout total: ${cartTotal.textContent}\nThis is a demo — no payment processed.`);
});

function initCountdown() {
  const target = new Date('2026-07-15T00:00:00');

  const els = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => el.textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = String(d).padStart(2, '0');
    els.hours.textContent = String(h).padStart(2, '0');
    els.minutes.textContent = String(m).padStart(2, '0');
    els.seconds.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let x = 0;
  let y = 0;
  let current = null;

  document.addEventListener('mousemove', e => {
    x = e.clientX;
    y = e.clientY;
    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;

    const target = e.target.closest('[data-cursor]');
    if (target) {
      if (target !== current) {
        current = target;
        cursorLabel.textContent = target.dataset.cursor;
        customCursor.classList.add('active');
      }
    } else if (current) {
      current = null;
      customCursor.classList.remove('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    current = null;
    customCursor.classList.remove('active');
  });
}

function initLookbookDrag() {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let rafId = null;

  function stopInertia() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function applyInertia() {
    if (Math.abs(velocity) < 0.5) {
      velocity = 0;
      return;
    }
    lookbookScroll.scrollLeft += velocity;
    velocity *= 0.92;
    rafId = requestAnimationFrame(applyInertia);
  }

  lookbookScroll.addEventListener('pointerdown', e => {
    isDown = true;
    if (lookbookScroll.setPointerCapture) lookbookScroll.setPointerCapture(e.pointerId);
    lookbookScroll.classList.add('active');
    stopInertia();
    startX = e.pageX;
    scrollLeft = lookbookScroll.scrollLeft;
    lastX = e.pageX;
    lastTime = performance.now();
    velocity = 0;
  });

  lookbookScroll.addEventListener('pointermove', e => {
    if (!isDown) return;
    e.preventDefault();
    const walk = e.pageX - startX;
    lookbookScroll.scrollLeft = scrollLeft - walk;

    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (e.pageX - lastX) / dt * 16;
    }
    lastX = e.pageX;
    lastTime = now;
  });

  lookbookScroll.addEventListener('pointerup', e => {
    isDown = false;
    lookbookScroll.classList.remove('active');
    applyInertia();
  });

  lookbookScroll.addEventListener('pointercancel', () => {
    isDown = false;
    lookbookScroll.classList.remove('active');
  });
}

initProducts();
updateCart();
initCountdown();
initCustomCursor();
initLookbookDrag();
