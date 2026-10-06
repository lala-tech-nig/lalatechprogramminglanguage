// ============================================================
// COMMUNITY PAGE JAVASCRIPT
// ============================================================

const API_SERVER = 'https://lalatechprogramminglanguage.onrender.com';
let currentType = 'all';
let currentSort = 'newest';
let currentStatus = 'all';
let commPage = 1;
let adminPassword = localStorage.getItem('lala_admin_pw') || '';
let isAdmin = false;
let upvotedPosts = new Set(JSON.parse(localStorage.getItem('lala_upvoted_posts') || '[]'));

const postsFeed = document.getElementById('posts-feed');
const postsPagination = document.getElementById('posts-pagination');
const adminBanner = document.getElementById('admin-banner');

// ---- SEED DATA (fallback) ----
const SEED_POSTS = [
  {
    _id: 'sp1', type: 'idea', title: 'Add Pidgin English dialect support',
    description: 'Nigerian Pidgin English is widely spoken across Nigeria. Adding "Pidgin" as a 5th dialect would make LALA accessible to millions more developers who code-switch between Pidgin and their native language.',
    author: 'Anonymous', upvotes: 78, status: 'open', visibility: 'public', dialect: 'any', version: 'v1.0.0',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'sp2', type: 'bug', title: 'ko keyword conflict in mixed-dialect files',
    description: 'When mixing Yorùbá and Hausa code in the same file without a dialect config, the word "ko" is ambiguous (means NOT in Yoruba, OR in Hausa). The lexer should provide a clearer error message or fallback.\n\nSteps to reproduce:\n1. Create a .lala file\n2. Use "ko" in a context that could be either\n3. Run without lala.config.json',
    author: 'dev_emeka', upvotes: 145, status: 'in-progress', visibility: 'public', dialect: 'yoruba', version: 'v1.0.0',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), screenshotUrl: ''
  },
  {
    _id: 'sp3', type: 'feature', title: 'LALA Package Manager (lala pkg install)',
    description: 'A dedicated LALA package manager similar to npm or pip, but for native LALA libraries. Should support:\n- lala pkg install <package>\n- lala pkg publish\n- A central registry at registry.lala.dev',
    author: 'Anonymous', upvotes: 203, status: 'open', visibility: 'public', dialect: 'any', version: 'general',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    _id: 'sp4', type: 'idea', title: 'VS Code Extension with dialect-aware autocomplete',
    description: 'A VS Code extension that provides:\n- Syntax highlighting for all 4 dialects\n- Autocomplete that knows your dialect (from lala.config.json)\n- Inline error messages in your dialect language',
    author: 'Fatima_Codes', upvotes: 167, status: 'open', visibility: 'public', dialect: 'any', version: 'general',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    _id: 'sp5', type: 'bug', title: 'py.eval() fails with multi-line Python code',
    description: 'Using py.eval() with multi-line expressions causes a ParseError. This should work:\npy.eval("x = 5\ny = x * 2\ny")\nBut throws: ParseError: unexpected token at line 2',
    author: 'Anonymous', upvotes: 91, status: 'resolved', visibility: 'public', dialect: 'any', version: 'v1.0.0',
    adminNotes: 'Fixed in v1.0.1 patch. Use py.exec() for multi-line code as documented.',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    _id: 'sp6', type: 'feature', title: 'Igbo standard library for mathematics terms',
    description: 'Add a lala:math module that uses Igbo mathematical vocabulary for function names alongside the English ones. E.g., gbakoo (multiply), kewaa (divide), tinyere (add).',
    author: 'Obi_Dev', upvotes: 54, status: 'open', visibility: 'public', dialect: 'igbo', version: 'general',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

// ---- LOAD STATS ----
async function loadStats() {
  try {
    const data = await apiGet('/api/community/stats');
    if (data.success) {
      updateStatEl('stat-total', data.total);
      updateStatEl('stat-ideas', data.ideas);
      updateStatEl('stat-bugs', data.bugs);
      updateStatEl('stat-features', data.features);
      updateStatEl('stat-resolved', data.resolved);
    }
  } catch {
    const counts = { total: 0, ideas: 0, bugs: 0, features: 0, resolved: 0 };
    SEED_POSTS.forEach(p => {
      if (p.visibility === 'public') {
        counts.total++;
        counts[p.type === 'feature' ? 'features' : p.type + 's']++;
        if (p.status === 'resolved') counts.resolved++;
      }
    });
    updateStatEl('stat-total', counts.total);
    updateStatEl('stat-ideas', counts.ideas);
    updateStatEl('stat-bugs', counts.bugs);
    updateStatEl('stat-features', counts.features);
    updateStatEl('stat-resolved', counts.resolved);
  }
}

function updateStatEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ---- LOAD POSTS ----
async function loadPosts() {
  showPostsLoading();
  try {
    const params = {
      type: currentType !== 'all' ? currentType : '',
      status: currentStatus !== 'all' ? currentStatus : '',
      sort: currentSort,
      page: commPage,
      limit: 10,
      adminPassword: isAdmin ? adminPassword : ''
    };
    const data = await apiGet('/api/community', params);
    if (data.success) renderPosts(data.posts, data.total, data.pages);
  } catch {
    let filtered = [...SEED_POSTS];
    if (currentType !== 'all') filtered = filtered.filter(p => p.type === currentType);
    if (currentStatus !== 'all') filtered = filtered.filter(p => p.status === currentStatus);
    if (currentSort === 'popular') filtered.sort((a, b) => b.upvotes - a.upvotes);
    renderPosts(filtered, filtered.length, 1);
  }
}

function showPostsLoading() {
  postsFeed.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>Loading posts…</span></div>`;
}

function renderPosts(posts, total, totalPages) {
  if (!posts.length) {
    postsFeed.innerHTML = `<div class="empty-state"><div class="empty-icon">${currentType === 'bug' ? '🐛' : currentType === 'idea' ? '💡' : '⚡'}</div><h3>No posts yet</h3><p>Be the first to post!</p><button class="btn btn-primary" style="margin-top:1rem" onclick="openModal('post-modal')">Create Post</button></div>`;
    postsPagination.innerHTML = '';
    return;
  }

  postsFeed.innerHTML = posts.map((p, i) => renderPostCard(p, i)).join('');
  renderCommPagination(totalPages);

  postsFeed.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.upvote-btn') && !e.target.closest('.admin-post-controls') && !e.target.closest('select') && !e.target.closest('button')) {
        const id = card.dataset.id;
        const post = posts.find(p => p._id === id);
        if (post) openPostDetail(post);
      }
    });
  });

  postsFeed.querySelectorAll('.upvote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); upvotePost(btn.dataset.id, btn); });
  });

  if (isAdmin) {
    postsFeed.querySelectorAll('.admin-save-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const card = btn.closest('.post-card');
        const statusSel = card.querySelector('.admin-select[data-field="status"]');
        const notesSel = card.querySelector('.admin-select[data-field="notes"]');
        try {
          await apiPatch(`/api/community/${id}/status`, { adminPassword, status: statusSel?.value });
          showToast('Status updated!', 'success');
          loadPosts();
        } catch (err) { showToast(`Failed: ${err.message}`, 'error'); }
      });
    });

    postsFeed.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Delete this post permanently?')) return;
        try {
          await apiDelete(`/api/community/${btn.dataset.id}`, { adminPassword });
          showToast('Post deleted.', 'success');
          loadPosts();
        } catch (err) { showToast(`Failed: ${err.message}`, 'error'); }
      });
    });
  }
}

function getTypeIcon(type) { return { idea: '💡', bug: '🐛', feature: '⚡' }[type] || '📝'; }
function getTypeLabel(type) { return { idea: 'Idea', bug: 'Bug Report', feature: 'Feature' }[type] || type; }
function getDialectLabel(d) { return { any: 'All Dialects', english: 'English', yoruba: 'Yorùbá', hausa: 'Hausa', igbo: 'Igbo' }[d] || d; }

function getStatusHtml(status) {
  const map = {
    open: '<span class="status-badge status-open">Open</span>',
    'in-progress': '<span class="status-badge status-in-progress">In Progress</span>',
    resolved: '<span class="status-badge status-resolved">Resolved</span>',
    declined: '<span class="status-badge status-declined">Declined</span>'
  };
  return map[status] || '';
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderPostCard(p, index) {
  const isUpvoted = upvotedPosts.has(p._id);

  const screenshotHtml = p.screenshotUrl
    ? `<img class="post-screenshot-thumb" src="${API_SERVER}${p.screenshotUrl}" alt="Bug screenshot" />`
    : '';

  const adminControlsHtml = isAdmin ? `
    <div class="admin-post-controls" onclick="event.stopPropagation()">
      <select class="admin-select" data-field="status">
        ${['open', 'in-progress', 'resolved', 'declined'].map(s =>
    `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s}</option>`
  ).join('')}
      </select>
      <button class="admin-save-btn" data-id="${p._id}">Save</button>
      <button class="admin-delete-btn" data-id="${p._id}">Delete</button>
      <span class="post-visibility-tag ${p.visibility === 'admin' ? 'vis-admin' : 'vis-public'}">
        ${p.visibility === 'admin' ? '🔐 Admin Only' : '🌍 Public'}
      </span>
    </div>` : '';

  return `
    <div class="post-card type-${p.type}" data-id="${p._id}" style="animation-delay:${index * 0.06}s">
      <div class="post-card-header">
        <div class="post-type-icon">${getTypeIcon(p.type)}</div>
        <div class="post-meta">
          <h3 class="post-title">${escapeHtml(p.title)}</h3>
          <div class="post-meta-row">
            <span class="tag tag-${p.type === 'bug' ? 'bug' : p.type === 'idea' ? 'idea' : 'feature'}">${getTypeLabel(p.type)}</span>
            ${getStatusHtml(p.status)}
            <span>by <strong>${escapeHtml(p.author || 'Anonymous')}</strong></span>
            <span>·</span>
            <span>${formatDate(p.createdAt)}</span>
            ${p.dialect !== 'any' ? `<span>·</span><span>${getDialectLabel(p.dialect)}</span>` : ''}
            <span>·</span><span>${p.version}</span>
          </div>
        </div>
      </div>
      ${screenshotHtml}
      <p class="post-desc">${escapeHtml(p.description)}</p>
      <div class="post-footer">
        <div class="post-actions">
          <button class="upvote-btn ${isUpvoted ? 'upvoted' : ''}" data-id="${p._id}">
            ▲ <span class="upvote-count">${p.upvotes || 0}</span>
          </button>
        </div>
        <span style="font-size:.75rem;color:var(--text-muted)">Click to expand</span>
      </div>
      ${adminControlsHtml}
    </div>`;
}

function renderCommPagination(totalPages) {
  if (totalPages <= 1) { postsPagination.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="changeCommPage(${commPage - 1})" ${commPage === 1 ? 'disabled' : ''}>←</button>`;
  for (let i = 1; i <= Math.min(totalPages, 7); i++) {
    html += `<button class="page-btn ${i === commPage ? 'active' : ''}" onclick="changeCommPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="changeCommPage(${commPage + 1})" ${commPage === totalPages ? 'disabled' : ''}>→</button>`;
  postsPagination.innerHTML = html;
}

window.changeCommPage = function(page) {
  commPage = page;
  loadPosts();
  document.getElementById('community-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ---- UPVOTE ----
async function upvotePost(id, btn) {
  if (upvotedPosts.has(id)) { showToast('Already upvoted!', 'info', 2000); return; }
  try {
    const data = await apiPost(`/api/community/${id}/upvote`);
    if (data.success) {
      upvotedPosts.add(id);
      localStorage.setItem('lala_upvoted_posts', JSON.stringify([...upvotedPosts]));
      btn.classList.add('upvoted');
      const countEl = btn.querySelector('.upvote-count');
      if (countEl) countEl.textContent = data.upvotes;
    }
  } catch {
    upvotedPosts.add(id);
    btn.classList.add('upvoted');
    const countEl = btn.querySelector('.upvote-count');
    if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    showToast('Upvoted!', 'success', 2000);
  }
}

// ---- POST DETAIL ----
function openPostDetail(post) {
  const titleEl = document.getElementById('post-detail-title');
  const bodyEl = document.getElementById('post-detail-body');
  if (titleEl) titleEl.textContent = post.title;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="post-detail-meta">
        <span class="tag tag-${post.type === 'bug' ? 'bug' : post.type === 'idea' ? 'idea' : 'feature'}">${getTypeIcon(post.type)} ${getTypeLabel(post.type)}</span>
        ${getStatusHtml(post.status)}
        <span style="font-size:.82rem;color:var(--text-muted)">by <strong style="color:var(--text-secondary)">${escapeHtml(post.author || 'Anonymous')}</strong></span>
        <span style="font-size:.82rem;color:var(--text-muted)">${formatDate(post.createdAt)}</span>
        <span style="font-size:.82rem;color:var(--lala-purple)">▲ ${post.upvotes || 0} upvotes</span>
        ${post.dialect !== 'any' ? `<span class="tag">${getDialectLabel(post.dialect)}</span>` : ''}
        <span style="font-size:.78rem;color:var(--text-muted)">${post.version}</span>
      </div>
      ${post.screenshotUrl ? `<img class="post-detail-image" src="${API_SERVER}${post.screenshotUrl}" alt="Screenshot" />` : ''}
      <p class="post-detail-desc">${escapeHtml(post.description)}</p>
      ${post.adminNotes ? `<div class="admin-notes-box"><h4>🔐 Admin Notes</h4><p>${escapeHtml(post.adminNotes)}</p></div>` : ''}`;
  }
  openModal('post-detail-modal');
}

// ---- SUBMIT POST ----
setupFileUpload('post-upload-area', 'post-screenshot', 'post-screenshot-preview');

const postDescEl = document.getElementById('post-description');
const descCharCount = document.getElementById('desc-char-count');
if (postDescEl && descCharCount) {
  postDescEl.addEventListener('input', () => {
    const len = postDescEl.value.length;
    descCharCount.textContent = len;
    descCharCount.parentElement.classList.toggle('limit', len > 2800);
  });
}

// Type selector
document.querySelectorAll('.post-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.post-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = document.getElementById('post-type-value');
    if (val) val.value = btn.dataset.type;
  });
});

// Visibility toggle
document.querySelectorAll('.vis-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vis-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const val = document.getElementById('post-visibility-value');
    if (val) val.value = btn.dataset.vis;
  });
});

// Submit post form
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const description = document.getElementById('post-description').value.trim();
    if (!title || !description) { showToast('Title and description are required.', 'error'); return; }

    const btn = document.getElementById('submit-post-btn');
    btn.disabled = true;
    btn.textContent = 'Posting…';

    try {
      const fd = new FormData();
      fd.append('type', document.getElementById('post-type-value').value);
      fd.append('title', title);
      fd.append('description', description);
      fd.append('author', document.getElementById('post-author').value.trim() || 'Anonymous');
      fd.append('visibility', document.getElementById('post-visibility-value').value);
      fd.append('dialect', document.getElementById('post-dialect').value);
      fd.append('version', document.getElementById('post-version').value);
      const screenshotFile = document.getElementById('post-screenshot').files[0];
      if (screenshotFile) fd.append('screenshot', screenshotFile);

      await apiPost('/api/community', fd, true);
      showToast('🎉 Post submitted!', 'success');
      closeModal('post-modal');
      postForm.reset();
      document.getElementById('post-screenshot-preview').innerHTML = '';
      document.querySelectorAll('.post-type-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
      document.getElementById('post-type-value').value = 'idea';
      document.querySelectorAll('.vis-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
      document.getElementById('post-visibility-value').value = 'public';
      commPage = 1;
      loadPosts();
      loadStats();
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Post to Community';
    }
  });
}

// ---- ADMIN LOGIN ----
window.adminLogin = async function() {
  const pwInput = document.getElementById('admin-password');
  const pw = pwInput?.value?.trim();
  if (!pw) { showToast('Enter the admin password.', 'error'); return; }

  try {
    const data = await apiGet('/api/community', { adminPassword: pw, limit: 1 });
    if (data.isAdmin) {
      adminPassword = pw;
      isAdmin = true;
      localStorage.setItem('lala_admin_pw', pw);
      closeModal('admin-modal');
      if (adminBanner) adminBanner.classList.remove('hidden');
      showToast('🔐 Admin mode activated.', 'success');
      loadPosts();
    } else {
      showToast('Invalid password.', 'error');
    }
  } catch {
    // Allow demo admin mode with default password
    if (pw === 'lala_admin_2024') {
      adminPassword = pw;
      isAdmin = true;
      closeModal('admin-modal');
      if (adminBanner) adminBanner.classList.remove('hidden');
      showToast('🔐 Admin mode activated (demo).', 'success');
      loadPosts();
    } else {
      showToast('Invalid password. Default: lala_admin_2024', 'error');
    }
  }
};

// Admin logout
const adminLogoutBtn = document.getElementById('admin-logout-btn');
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener('click', () => {
    isAdmin = false;
    adminPassword = '';
    localStorage.removeItem('lala_admin_pw');
    adminBanner.classList.add('hidden');
    showToast('Logged out of admin mode.', 'info');
    loadPosts();
  });
}

// ---- OPEN POST MODAL WITH TYPE ----
window.openPostModal = function(type) {
  openModal('post-modal');
  document.querySelectorAll('.post-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const val = document.getElementById('post-type-value');
  if (val) val.value = type;
};

// ---- FILTERS ----
document.querySelectorAll('.comm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.comm-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentType = tab.dataset.type;
    commPage = 1;
    loadPosts();
  });
});

document.getElementById('comm-sort-select')?.addEventListener('change', e => {
  currentSort = e.target.value; commPage = 1; loadPosts();
});

document.getElementById('comm-status-select')?.addEventListener('change', e => {
  currentStatus = e.target.value; commPage = 1; loadPosts();
});

// ---- URL HASH ----
if (window.location.hash === '#bugs') {
  setTimeout(() => {
    document.querySelector('.comm-tab[data-type="bug"]')?.click();
  }, 200);
}

// ---- INIT ----
loadStats();
loadPosts();
