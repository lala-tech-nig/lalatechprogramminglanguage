// ============================================================
// GLOBAL.JS — Shared utilities for LALA website (White Theme)
// ============================================================

const API_BASE = 'https://lalatechprogramminglanguage.onrender.com';

// ---- NAVBAR ----
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });
  }
})();

// ---- SCROLL REVEAL ----
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ---- TOAST SYSTEM ----
let toastContainer = null;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

window.showToast = function(message, type = 'info', duration = 3500) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="flex:1">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// ---- MODAL SYSTEM ----
window.openModal = function(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(id);
    }, { once: true });
    // Close on Escape
    const escHandler = (e) => { if (e.key === 'Escape') { closeModal(id); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);
  }
};

window.closeModal = function(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ---- DATE FORMATTER ----
window.formatDate = function(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)     return 'just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ---- API HELPERS ----
window.apiGet = async function(path, params = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v); });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

window.apiPost = async function(path, bodyOrFormData = {}, isFormData = false) {
  const opts = { method: 'POST' };
  if (isFormData) {
    opts.body = bodyOrFormData;
  } else {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(bodyOrFormData);
  }
  const res = await fetch(API_BASE + path, opts);
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
  return res.json();
};

window.apiPatch = async function(path, body = {}) {
  const res = await fetch(API_BASE + path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

window.apiDelete = async function(path, body = {}) {
  const res = await fetch(API_BASE + path, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ---- FILE UPLOAD HELPER ----
window.setupFileUpload = function(areaId, inputId, previewId) {
  const area    = document.getElementById(areaId);
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!area || !input || !preview) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFilePreview(file, input, preview, area);
  });
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) handleFilePreview(file, input, preview, area);
  });
};

function handleFilePreview(file, input, preview, area) {
  if (!file.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); return; }
  if (file.size > 8 * 1024 * 1024) { showToast('File must be under 8MB.', 'error'); return; }

  // Put file on input
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.innerHTML = `
      <div style="position:relative;margin-top:.75rem">
        <img src="${e.target.result}" alt="Preview" style="width:100%;border-radius:var(--radius-lg);max-height:180px;object-fit:cover;border:1.5px solid var(--border-light)" />
        <button type="button" onclick="clearFilePreview('${input.id}','${preview.id}')"
          style="position:absolute;top:6px;right:6px;background:white;border:1px solid var(--border-light);border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:.8rem;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm)">✕</button>
        <p style="font-size:.75rem;color:var(--text-muted);margin-top:.4rem">${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
      </div>`;
    area.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

window.clearFilePreview = function(inputId, previewId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const area    = input?.previousElementSibling || input?.parentElement?.querySelector('.file-upload-area');
  if (input)   input.value = '';
  if (preview) preview.innerHTML = '';
  if (area)    area.style.display = '';
};

// ---- COPY NPM COMMAND ----
window.copyNpm = function() {
  navigator.clipboard.writeText('npm install -g lala-lang').then(() => {
    showToast('📋 Copied to clipboard!', 'success', 2000);
    const btn = document.getElementById('copy-npm-btn');
    if (btn) { btn.textContent = '✅'; setTimeout(() => btn.textContent = '📋', 2000); }
  }).catch(() => showToast('Copy failed — try manually.', 'error'));
};

// ---- SYNTAX HIGHLIGHT for static code blocks ----
window.highlightCode = function(code, dialect) {
  const dialectKw = {
    english: ['let','var','print','if','else','for','while','function','return','class','init','new','this','true','false','null','and','or','not','import','as','in','async','await','of'],
    yoruba:  ['jẹ','var','sọ','bí','siwaju','fun','nigba','iṣẹ','padà','ẹgbẹ','init','new','this','òótọ́','irọ','aṣefaanu','àti','tabi','kò','import','as','in','async','await'],
    hausa:   ['bari','var','nuna','idan','ko haka','don','yayin','aiki','dawo','ajin','init','new','this','gaskiya','ƙarya','komai','da','ko','ba','import','as','in','async','await'],
    igbo:    ['were','var','bịpụta','ọ bụrụ','ma ọ bụ','maka','oge','ọrụ','laghachi','otu','init','new','this','ọ bụ eziokwu','ọ bụ asị','efu','na','ma ọ bụ','abụghị','import','as','in','async','await']
  };
  const kws = dialectKw[dialect] || dialectKw.english;
  return code
    .replace(/\/\/[^\n]*/g, m => `<span class="cmt">${m}</span>`)
    .replace(/"([^"\\]|\\.)*"/g, m => `<span class="str">${m}</span>`)
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="num">$1</span>')
    .replace(new RegExp(`\\b(${kws.join('|')})\\b`, 'g'), '<span class="kw">$1</span>');
};

// ---- ANIMATED COUNTER ----
window.animateCounter = function(el, target, suffix = '', duration = 2000) {
  if (!el) return;
  if (target >= 1000000) { el.textContent = Math.floor(target / 1000000) + 'M'; return; }
  if (target >= 1000)    { el.textContent = Math.floor(target / 1000) + 'K'; return; }
  const start = 0;
  const step = Math.max(1, Math.floor(target / (duration / 16)));
  let cur = start;
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + suffix;
    if (cur >= target) clearInterval(timer);
  }, 16);
};
