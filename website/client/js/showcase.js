// ============================================================
// SHOWCASE PAGE JAVASCRIPT
// ============================================================

const API_SERVER = 'https://lalatechprogramminglanguage.onrender.com';
let currentPage = 1;
let currentDialect = 'all';
let currentSort = 'newest';
let likedProjects = new Set(JSON.parse(localStorage.getItem('lala_liked_projects') || '[]'));

const projectsGrid = document.getElementById('projects-grid');
const projectsPagination = document.getElementById('projects-pagination');
const totalProjectsEl = document.getElementById('total-projects');

// ---- SEED DATA (shown when API unavailable) ----
const SEED_PROJECTS = [
  {
    _id: 'seed1',
    title: 'Naira Budget Tracker',
    author: 'Adewale Okafor',
    dialect: 'yoruba',
    description: 'A command-line personal finance tracker that lets you track income and expenses in Yorùbá. Uses LALA\'s OOP features to model accounts and transactions.',
    tags: ['cli', 'finance', 'oop'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    likes: 42,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'seed2',
    title: 'Hausa Chatbot Framework',
    author: 'Amina Bello',
    dialect: 'hausa',
    description: 'An NLP-powered chatbot framework for building Hausa-language conversational agents. Uses py.import("transformers") for the ML backend.',
    tags: ['nlp', 'ai', 'python-interop'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 67,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    _id: 'seed3',
    title: 'Igbo Number Recognition',
    author: 'Emeka Okonkwo',
    dialect: 'igbo',
    description: 'A digit recognition model trained on handwritten Igbo numerals. Bridges Python numpy and tensorflow through LALA\'s Python IPC bridge.',
    tags: ['ml', 'computer-vision', 'python-interop'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    likes: 89,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: 'seed4',
    title: 'Nigerian Stock API Wrapper',
    author: 'Chinedu Eze',
    dialect: 'english',
    description: 'A LALA library wrapping the Nigerian Exchange Group (NGX) API. Uses js.fetch for HTTP calls and returns clean object models.',
    tags: ['api', 'finance', 'js-interop'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 31,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    _id: 'seed5',
    title: 'Multilingual Recipe App',
    author: 'Fatima Abdullahi',
    dialect: 'mixed',
    description: 'A recipe management app that stores recipes in any of the 4 LALA dialects and auto-translates them using the built-in dialect translator.',
    tags: ['web', 'translation', 'mixed-dialect'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    likes: 55,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    _id: 'seed6',
    title: 'LALA Web Server (HTTP)',
    author: 'Babatunde Adeyemi',
    dialect: 'english',
    description: 'A minimal HTTP web server framework built purely in LALA, using js.require("http") for networking and LALA classes for routing.',
    tags: ['web', 'server', 'framework'],
    githubUrl: 'https://github.com',
    liveUrl: '',
    likes: 112,
    screenshotUrl: '',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// ---- LOAD PROJECTS ----
async function loadProjects() {
  showGridLoading();
  try {
    const data = await apiGet('/api/projects', {
      dialect: currentDialect !== 'all' ? currentDialect : '',
      sort: currentSort,
      page: currentPage,
      limit: 9
    });
    if (data.success) {
      renderProjects(data.projects, data.total, data.pages);
      if (totalProjectsEl) totalProjectsEl.textContent = data.total;
    }
  } catch (err) {
    // Fallback to seed data
    let filtered = [...SEED_PROJECTS];
    if (currentDialect !== 'all') filtered = filtered.filter(p => p.dialect === currentDialect);
    if (currentSort === 'popular') filtered.sort((a, b) => b.likes - a.likes);
    renderProjects(filtered, filtered.length, 1);
    if (totalProjectsEl) totalProjectsEl.textContent = filtered.length;
  }
}

function showGridLoading() {
  projectsGrid.innerHTML = Array.from({ length: 6 }, () =>
    `<div class="project-card" style="animation:none;opacity:1;">
      <div class="project-screenshot-placeholder skeleton" style="height:180px;border-radius:0;"></div>
      <div class="project-body">
        <div class="skeleton" style="height:20px;width:70%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:14px;width:40%;margin-bottom:12px;"></div>
        <div class="skeleton" style="height:60px;"></div>
      </div>
    </div>`
  ).join('');
}

function renderProjects(projects, total, totalPages) {
  if (!projects.length) {
    projectsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔭</div>
        <h3>No projects yet</h3>
        <p>Be the first to submit a project in this dialect!</p>
        <button class="btn btn-primary" style="margin-top:1rem" onclick="openModal('submit-modal')">Submit Project</button>
      </div>`;
    projectsPagination.innerHTML = '';
    return;
  }

  projectsGrid.innerHTML = projects.map((p, i) => renderProjectCard(p, i)).join('');
  renderPagination(totalPages);

  // Attach event listeners
  projectsGrid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.project-like-btn') && !e.target.closest('.project-link-btn') && !e.target.closest('a')) {
        const id = card.dataset.id;
        const project = projects.find(p => p._id === id);
        if (project) openProjectDetail(project);
      }
    });
  });

  projectsGrid.querySelectorAll('.project-like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      likeProject(btn.dataset.id, btn);
    });
  });
}

function getDialectEmoji(dialect) {
  return { english: '🇬🇧', yoruba: '🇳🇬', hausa: '🇳🇬', igbo: '🇳🇬', mixed: '🌍' }[dialect] || '';
}

function getDialectLabel(dialect) {
  return { english: 'English', yoruba: 'Yorùbá', hausa: 'Hausa', igbo: 'Igbo', mixed: 'Mixed' }[dialect] || dialect;
}

function getProjectIcon(p) {
  const icons = { finance: '💰', nlp: '🤖', ai: '🧠', ml: '🔬', web: '🌐', cli: '💻', api: '🔗', server: '🖥️', recipe: '🍲' };
  const tag = p.tags?.[0]?.toLowerCase() || '';
  return Object.entries(icons).find(([k]) => tag.includes(k))?.[1] || '🚀';
}

function renderProjectCard(p, index) {
  const isLiked = likedProjects.has(p._id);
  const imgHtml = p.screenshotUrl
    ? `<img class="project-screenshot" src="${API_SERVER}${p.screenshotUrl}" alt="${p.title}" loading="lazy" />`
    : `<div class="project-screenshot-placeholder">${getProjectIcon(p)}</div>`;

  const tagsHtml = (p.tags || []).slice(0, 4).map(t =>
    `<span class="project-tag">${t}</span>`
  ).join('');

  const linksHtml = [
    p.githubUrl ? `<a class="project-link-btn" href="${p.githubUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">⭐ GitHub</a>` : '',
    p.liveUrl ? `<a class="project-link-btn" href="${p.liveUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">🔗 Live</a>` : ''
  ].join('');

  return `
    <div class="project-card" data-id="${p._id}" style="animation-delay:${index * 0.07}s">
      ${imgHtml}
      <div class="project-body">
        <div class="project-header">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <span class="project-dialect-badge badge-${p.dialect}">${getDialectEmoji(p.dialect)} ${getDialectLabel(p.dialect)}</span>
        </div>
        <p class="project-author">by <span>${escapeHtml(p.author)}</span> · <span>${formatDate(p.createdAt)}</span></p>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-footer">
          <div class="project-links">${linksHtml}</div>
          <button class="project-like-btn ${isLiked ? 'liked' : ''}" data-id="${p._id}">
            ❤️ <span class="like-count">${p.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>`;
}

function renderPagination(totalPages) {
  if (totalPages <= 1) { projectsPagination.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
  projectsPagination.innerHTML = html;
}

window.changePage = function(page) {
  currentPage = page;
  loadProjects();
  window.scrollTo({ top: document.getElementById('showcase-main').offsetTop - 80, behavior: 'smooth' });
};

// ---- LIKE ----
async function likeProject(id, btn) {
  if (likedProjects.has(id)) { showToast('You already liked this project!', 'info', 2000); return; }
  try {
    const data = await apiPost(`/api/projects/${id}/like`);
    if (data.success) {
      likedProjects.add(id);
      localStorage.setItem('lala_liked_projects', JSON.stringify([...likedProjects]));
      btn.classList.add('liked');
      const countEl = btn.querySelector('.like-count');
      if (countEl) countEl.textContent = data.likes;
      showToast('Project liked! ❤️', 'success', 2000);
    }
  } catch {
    // Seed mode: just update UI
    likedProjects.add(id);
    btn.classList.add('liked');
    const countEl = btn.querySelector('.like-count');
    if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    showToast('Project liked! ❤️', 'success', 2000);
  }
}

// ---- PROJECT DETAIL ----
function openProjectDetail(project) {
  const titleEl = document.getElementById('detail-title');
  const bodyEl = document.getElementById('project-detail-body');
  if (titleEl) titleEl.textContent = project.title;
  if (bodyEl) {
    bodyEl.innerHTML = `
      ${project.screenshotUrl ? `<img class="project-detail-img" src="${API_SERVER}${project.screenshotUrl}" alt="${project.title}" />` : ''}
      <div class="project-detail-meta">
        <span class="project-dialect-badge badge-${project.dialect}">${getDialectEmoji(project.dialect)} ${getDialectLabel(project.dialect)}</span>
        <span style="color:var(--text-muted);font-size:.85rem">by <strong style="color:var(--text-secondary)">${escapeHtml(project.author)}</strong></span>
        <span style="color:var(--text-muted);font-size:.85rem">${formatDate(project.createdAt)}</span>
        <span style="color:hsl(0,80%,65%);font-size:.85rem">❤️ ${project.likes || 0} likes</span>
      </div>
      <p class="project-detail-desc">${escapeHtml(project.description)}</p>
      ${project.tags?.length ? `<div class="project-tags" style="margin-bottom:1.5rem">${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
      <div class="project-detail-links">
        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank" rel="noopener">⭐ View on GitHub</a>` : ''}
        ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener">🔗 Visit Live Project</a>` : ''}
      </div>`;
  }
  openModal('project-detail-modal');
}

// ---- SUBMIT FORM ----
setupFileUpload('proj-upload-area', 'proj-screenshot', 'proj-screenshot-preview');

const submitForm = document.getElementById('submit-project-form');
if (submitForm) {
  submitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('proj-title').value.trim();
    const author = document.getElementById('proj-author').value.trim();
    const description = document.getElementById('proj-description').value.trim();

    if (!title || !author || !description) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const btn = document.getElementById('submit-form-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('author', author);
      fd.append('description', description);
      fd.append('dialect', document.getElementById('proj-dialect').value);
      fd.append('githubUrl', document.getElementById('proj-github').value.trim());
      fd.append('liveUrl', document.getElementById('proj-live').value.trim());
      fd.append('tags', document.getElementById('proj-tags').value.trim());
      const screenshotFile = document.getElementById('proj-screenshot').files[0];
      if (screenshotFile) fd.append('screenshot', screenshotFile);

      await apiPost('/api/projects', fd, true);
      showToast('🎉 Project submitted successfully!', 'success');
      closeModal('submit-modal');
      submitForm.reset();
      document.getElementById('proj-screenshot-preview').innerHTML = '';
      currentPage = 1;
      loadProjects();
    } catch (err) {
      showToast(`Submission failed: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Submit Project';
    }
  });
}

// ---- FILTERS ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDialect = btn.dataset.dialect;
    currentPage = 1;
    loadProjects();
  });
});

document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  loadProjects();
});

// ---- UTILS ----
function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- INIT ----
loadProjects();
