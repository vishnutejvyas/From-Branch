// =============================
// FROM BRANCH — SCRIPT.JS
// =============================

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.innerHTML = mobileMenu.classList.contains('open') ? '&#10005;' : '&#9776;';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.innerHTML = '&#9776;';
  });
});


// ---- STICKY HEADER SHADOW ----
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
  } else {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  }
});


// ---- SCROLL ANIMATION (Intersection Observer) ----
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger delay
      const delay = (entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Set stagger delays
animatedEls.forEach((el, i) => {
  el.dataset.delay = (i % 4) * 100; // 0, 100, 200, 300 ms stagger per row of 4
  observer.observe(el);
});


// ---- COUNTER ANIMATION ----
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}


// ---- MODAL LOGIC ----
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const loginTrigger = document.getElementById('login-trigger');
const mobilLogin   = document.getElementById('mobile-login');

const tabLogin  = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

function openModal(tab = 'login') {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  switchTab(tab);
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  clearAllErrors();
}

function switchTab(tab) {
  if (tab === 'login') {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    loginForm.classList.add('active'); signupForm.classList.remove('active');
  } else {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    signupForm.classList.add('active'); loginForm.classList.remove('active');
  }
  clearAllErrors();
}

loginTrigger.addEventListener('click', () => openModal('login'));
if (mobilLogin) mobilLogin.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

tabLogin.addEventListener('click', () => switchTab('login'));
tabSignup.addEventListener('click', () => switchTab('signup'));

document.getElementById('go-signup').addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });
document.getElementById('go-login').addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});


// ---- FORM VALIDATION HELPERS ----
function setError(inputId, errId, message) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) { input.classList.add('error-field'); input.classList.remove('success-field'); }
  if (err) err.textContent = message;
  return false;
}

function setSuccess(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (input) { input.classList.remove('error-field'); input.classList.add('success-field'); }
  if (err) err.textContent = '';
  return true;
}

function clearAllErrors() {
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  document.querySelectorAll('.error-field').forEach(e => e.classList.remove('error-field'));
  document.querySelectorAll('.success-field').forEach(e => e.classList.remove('success-field'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function isValidPassword(password) {
  return password.length >= 8;
}

// Live validation on input
function addLiveValidation(inputEl, validator, errId) {
  const inputId = inputEl.id;
  inputEl.addEventListener('input', () => {
    const val = inputEl.value.trim();
    if (validator(val)) {
      setSuccess(inputId, errId);
    } else {
      inputEl.classList.remove('success-field');
      inputEl.classList.add('error-field');
    }
  });
  inputEl.addEventListener('blur', () => {
    const val = inputEl.value.trim();
    if (!val || !validator(val)) {
      setError(inputId, errId, '');
    }
  });
}

// Attach live validation for fields
const liveFields = [
  { id: 'login-email',   errId: 'login-email-err',  fn: isValidEmail },
  { id: 'login-pass',    errId: 'login-pass-err',   fn: isValidPassword },
  { id: 'reg-name',      errId: 'reg-name-err',     fn: v => v.length >= 2 },
  { id: 'reg-email',     errId: 'reg-email-err',    fn: isValidEmail },
  { id: 'reg-phone',     errId: 'reg-phone-err',    fn: isValidPhone },
  { id: 'reg-pass',      errId: 'reg-pass-err',     fn: isValidPassword },
];
liveFields.forEach(({ id, errId, fn }) => {
  const el = document.getElementById(id);
  if (el) addLiveValidation(el, fn, errId);
});


// ---- LOGIN FORM SUBMIT ----
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  let valid = true;

  if (!email) {
    valid = setError('login-email', 'login-email-err', 'Email is required.') || false;
  } else if (!isValidEmail(email)) {
    valid = setError('login-email', 'login-email-err', 'Enter a valid email address.') || false;
  } else {
    setSuccess('login-email', 'login-email-err');
  }

  if (!password) {
    valid = setError('login-pass', 'login-pass-err', 'Password is required.') || false;
  } else if (!isValidPassword(password)) {
    valid = setError('login-pass', 'login-pass-err', 'Password must be at least 8 characters.') || false;
  } else {
    setSuccess('login-pass', 'login-pass-err');
  }

  if (valid) {
    closeModal();
    showToast('🌿 Welcome back! You are logged in.');
  }
});


// ---- SIGNUP FORM SUBMIT ----
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('reg-name').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();
  const pass    = document.getElementById('reg-pass').value.trim();
  const confirm = document.getElementById('reg-confirm').value.trim();
  const terms   = document.getElementById('reg-terms').checked;
  let valid = true;

  // Name
  if (!name) {
    valid = setError('reg-name', 'reg-name-err', 'Full name is required.') || false;
  } else if (name.length < 2) {
    valid = setError('reg-name', 'reg-name-err', 'Name must be at least 2 characters.') || false;
  } else { setSuccess('reg-name', 'reg-name-err'); }

  // Email
  if (!email) {
    valid = setError('reg-email', 'reg-email-err', 'Email is required.') || false;
  } else if (!isValidEmail(email)) {
    valid = setError('reg-email', 'reg-email-err', 'Enter a valid email address.') || false;
  } else { setSuccess('reg-email', 'reg-email-err'); }

  // Phone
  if (!phone) {
    valid = setError('reg-phone', 'reg-phone-err', 'Phone number is required.') || false;
  } else if (!isValidPhone(phone)) {
    valid = setError('reg-phone', 'reg-phone-err', 'Enter a valid 10-digit Indian mobile number.') || false;
  } else { setSuccess('reg-phone', 'reg-phone-err'); }

  // Password
  if (!pass) {
    valid = setError('reg-pass', 'reg-pass-err', 'Password is required.') || false;
  } else if (!isValidPassword(pass)) {
    valid = setError('reg-pass', 'reg-pass-err', 'Password must be at least 8 characters.') || false;
  } else { setSuccess('reg-pass', 'reg-pass-err'); }

  // Confirm Password
  if (!confirm) {
    valid = setError('reg-confirm', 'reg-confirm-err', 'Please confirm your password.') || false;
  } else if (pass !== confirm) {
    valid = setError('reg-confirm', 'reg-confirm-err', 'Passwords do not match.') || false;
  } else { setSuccess('reg-confirm', 'reg-confirm-err'); }

  // Terms
  if (!terms) {
    document.getElementById('reg-terms-err').textContent = 'You must accept the terms & conditions.';
    valid = false;
  } else {
    document.getElementById('reg-terms-err').textContent = '';
  }

  if (valid) {
    closeModal();
    showToast(`🎉 Welcome to From Branch, ${name}!`);
  }
});


// ---- CART LOGIC ----
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`🛒 ${name} added to cart!`);
}

function updateCartUI() {
  const list  = document.getElementById('cart-list');
  const count = document.getElementById('cart-count');
  const total = document.getElementById('cart-total');

  list.innerHTML = '';
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.qty;
    totalItems += item.qty;
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name} × ${item.qty}</span><span>₹${item.price * item.qty}</span>`;
    list.appendChild(li);
  });

  count.textContent = totalItems;
  total.textContent = totalPrice;
}

function checkout() {
  if (cart.length === 0) {
    showToast('🛒 Your cart is empty!');
    return;
  }
  cart = [];
  updateCartUI();
  showToast('✅ Order placed successfully! Thank you 🌿');
}


// ---- TOAST ----
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}


// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.nav-link .nav-btn');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(btn => {
    btn.classList.remove('active');
    const href = btn.closest('.nav-link')?.getAttribute('href');
    if (href === `#${current}`) btn.classList.add('active');
  });
});
