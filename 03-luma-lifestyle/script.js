const products = [
  {
    id: 1,
    name: 'Linen Everyday Shirt',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    description: 'A relaxed button-up in washed organic linen. Breathable, soft, and made to layer year-round.',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Terracotta Wide Trousers',
    price: '$112',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
    description: 'High-waisted trousers in a warm clay tone. Clean drape, elastic-back waist, and deep pockets.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 3,
    name: 'Sage Knit Cardigan',
    price: '$128',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    description: 'A feather-soft cardigan knit from responsibly sourced wool. The perfect third layer.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 4,
    name: 'Dusty Blush Scarf',
    price: '$54',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    description: 'A lightweight woven scarf in muted blush. Finished with a raw, hand-frayed edge.',
    sizes: ['One Size']
  }
];

const grid = document.getElementById('product-grid');
const modal = document.getElementById('quick-view');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalSizes = document.getElementById('modal-sizes');
const addToBag = document.getElementById('add-to-bag');
const cartCount = document.getElementById('cart-count');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const newsletterForm = document.getElementById('newsletter-form');
const formNote = document.getElementById('form-note');

let cartItems = 0;

function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Open quick view for ${p.name}">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-meta">
        <h3>${p.name}</h3>
        <p>${p.price}</p>
      </div>
    </article>
  `).join('');
}

function openModal(product) {
  modalImg.src = product.image;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = product.price;
  modalDesc.textContent = product.description;

  modalSizes.innerHTML = product.sizes.map((size, i) => `
    <div class="size-option">
      <input type="radio" name="size" id="size-${size}" value="${size}" ${i === 0 ? 'checked' : ''}>
      <label for="size-${size}">${size}</label>
    </div>
  `).join('');

  addToBag.textContent = 'Add to Bag';
  addToBag.disabled = false;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const product = products.find(p => p.id === Number(card.dataset.id));
  if (product) openModal(product);
});

grid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.product-card');
    if (!card) return;
    e.preventDefault();
    const product = products.find(p => p.id === Number(card.dataset.id));
    if (product) openModal(product);
  }
});

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    closeModal();
  }
});

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

addToBag.addEventListener('click', () => {
  cartItems += 1;
  cartCount.textContent = cartItems;
  cartCount.setAttribute('data-count', cartItems);

  addToBag.textContent = 'Added';
  addToBag.disabled = true;
  setTimeout(() => {
    addToBag.textContent = 'Add to Bag';
    addToBag.disabled = false;
  }, 1200);
});

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thank you for subscribing to LUMA.';
  newsletterForm.reset();
});

// Parallax hero backgrounds
const heroBgs = document.querySelectorAll('.hero-card__bg');
let ticking = false;

function updateParallax() {
  const y = window.scrollY;
  heroBgs.forEach(img => {
    img.style.transform = `translateY(${y * 0.08}px)`;
  });
  ticking = false;
}

if (heroBgs.length) {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
    updateParallax();
  }
}

renderProducts();
