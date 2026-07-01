/**
 * V-Guard Knowledge Dashboard — dashboard.js
 */

const API = '/api/dashboard';

// ── Tab navigation ────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');

    if (btn.dataset.tab === 'data')     loadSources();
    if (btn.dataset.tab === 'pinecone') loadPineconeStats();
  });
});

// ── Log helper ────────────────────────────────────────────────────────────────
function logLine(boxId, text, cls = '') {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.style.display = 'block';
  const line = document.createElement('div');
  line.className = `log-line ${cls}`;

  let finalCls = cls;
  if (!cls) {
    if (text.includes('✅') || text.includes('OK') || text.includes('Done') || text.toLowerCase().includes('saved'))
      finalCls = 'log-ok';
    else if (text.includes('ERROR') || text.includes('✗') || text.includes('Failed'))
      finalCls = 'log-err';
    else if (text === '[DONE]')
      finalCls = 'log-done';
  }
  line.className = `log-line ${finalCls}`;
  line.textContent = text;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function clearLog(boxId) {
  const box = document.getElementById(boxId);
  if (box) { box.innerHTML = ''; box.style.display = 'none'; }
}

// ── SSE streaming helper ──────────────────────────────────────────────────────
async function streamPost(url, body, logBoxId, onDone) {
  clearLog(logBoxId);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : '{}',
    });
    if (!resp.ok) {
      const err = await resp.text();
      logLine(logBoxId, `ERROR: ${err}`, 'log-err');
      onDone && onDone(false);
      return;
    }

    const reader  = resp.body.getReader();
    const decoder = new TextDecoder();
    let   buffer  = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          logLine(logBoxId, '── Done ──', 'log-done');
          onDone && onDone(true);
          return;
        }
        logLine(logBoxId, data);
      }
    }
    onDone && onDone(true);
  } catch (e) {
    logLine(logBoxId, `Error: ${e.message}`, 'log-err');
    onDone && onDone(false);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// URLS TAB
// ══════════════════════════════════════════════════════════════════════════════

let urlConfigs = [];

async function loadUrls() {
  const resp = await fetch(`${API}/urls`);
  urlConfigs = await resp.json();
  renderUrlTable();
}

function renderUrlTable() {
  const tbody = document.getElementById('url-tbody');
  document.getElementById('url-count').textContent = `${urlConfigs.length} URL${urlConfigs.length !== 1 ? 's' : ''}`;

  if (urlConfigs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No URLs configured. Add one above.</td></tr>';
    return;
  }

  tbody.innerHTML = urlConfigs.map((cfg, i) => `
    <tr>
      <td class="text-dim">${i + 1}</td>
      <td style="max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        <a href="${escHtml(cfg.url)}" target="_blank" style="color:var(--accent2)">${escHtml(cfg.url)}</a>
      </td>
      <td>
        <span class="badge ${cfg.mode === 'crawl' ? 'badge-crawl' : 'badge-exact'}">${cfg.mode}</span>
      </td>
      <td class="text-dim">${cfg.mode === 'crawl' ? cfg.max_pages : '—'}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="editUrl(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUrl(${i})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Show/hide max-pages row based on mode selection
document.getElementById('add-url-mode').addEventListener('change', function () {
  document.getElementById('max-pages-row').style.display =
    this.value === 'crawl' ? 'flex' : 'none';
});
// Initial state
document.getElementById('max-pages-row').style.display = 'none';

document.getElementById('add-url-btn').addEventListener('click', async () => {
  const url      = document.getElementById('add-url-input').value.trim();
  const mode     = document.getElementById('add-url-mode').value;
  const maxPages = parseInt(document.getElementById('add-url-maxpages').value) || 100;

  if (!url) { alert('Please enter a URL'); return; }

  const resp = await fetch(`${API}/urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, mode, max_pages: maxPages }),
  });
  if (resp.ok) {
    document.getElementById('add-url-input').value = '';
    await loadUrls();
  } else {
    alert('Failed to add URL');
  }
});

async function deleteUrl(idx) {
  if (!confirm(`Delete URL #${idx + 1}?`)) return;
  const resp = await fetch(`${API}/urls/${idx}`, { method: 'DELETE' });
  if (resp.ok) await loadUrls();
}

function editUrl(idx) {
  const cfg = urlConfigs[idx];
  const newUrl = prompt('URL:', cfg.url);
  if (newUrl === null) return;
  const newMode = prompt('Mode (exact/crawl):', cfg.mode);
  if (newMode === null) return;
  const newMax = newMode === 'crawl'
    ? parseInt(prompt('Max pages:', cfg.max_pages) || cfg.max_pages)
    : 1;

  fetch(`${API}/urls/${idx}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: newUrl, mode: newMode, max_pages: newMax }),
  }).then(() => loadUrls());
}

// Smart Scrape button
document.getElementById('smart-scrape-btn').addEventListener('click', async () => {
  const btn = document.getElementById('smart-scrape-btn');
  btn.disabled = true;
  btn.textContent = 'Smart Scraping…';
  await streamPost(`${API}/smart-scrape`, null, 'scrape-log', () => {
    btn.disabled = false;
    btn.textContent = '⚡ Smart Scrape (Recommended)';
    loadKbStats();
  });
});

// Raw Scrape button
document.getElementById('scrape-btn').addEventListener('click', async () => {
  const btn = document.getElementById('scrape-btn');
  btn.disabled = true;
  btn.textContent = 'Scraping...';
  await streamPost(`${API}/scrape`, null, 'scrape-log', () => {
    btn.disabled = false;
    btn.textContent = 'Scrape All URLs';
    loadKbStats();
  });
});

// Process button
document.getElementById('process-btn').addEventListener('click', async () => {
  const btn = document.getElementById('process-btn');
  btn.disabled = true;
  btn.textContent = 'Processing...';
  await streamPost(`${API}/process`, null, 'scrape-log', () => {
    btn.disabled = false;
    btn.textContent = 'Process → Chunks';
    loadKbStats();
  });
});


// ══════════════════════════════════════════════════════════════════════════════
// DATA VIEWER TAB
// ══════════════════════════════════════════════════════════════════════════════

let chunkPage   = 0;
const CHUNK_LIMIT = 50;
let chunkData   = { total: 0, chunks: [] };

async function loadSources() {
  const resp = await fetch(`${API}/chunks/sources`);
  const sources = await resp.json();
  const sel = document.getElementById('filter-source');
  const current = sel.value;
  sel.innerHTML = '<option value="">All sources</option>';
  sources.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.source;
    opt.textContent = `${s.source} (${s.count} chunks, ${s.languages.join('/')})`;
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

async function loadChunks(resetPage = true) {
  if (resetPage) chunkPage = 0;
  const source = document.getElementById('filter-source').value;
  const lang   = document.getElementById('filter-lang').value;
  const params = new URLSearchParams({
    limit:  CHUNK_LIMIT,
    offset: chunkPage * CHUNK_LIMIT,
  });
  if (source) params.set('source', source);
  if (lang)   params.set('language', lang);

  const resp = await fetch(`${API}/chunks?${params}`);
  chunkData = await resp.json();

  document.getElementById('chunk-total').textContent =
    `${chunkData.total} chunk${chunkData.total !== 1 ? 's' : ''}`;

  // Show/hide delete source button
  const delBtn = document.getElementById('delete-source-btn');
  delBtn.style.display = source ? 'inline-flex' : 'none';

  renderChunksTable();
  renderPagination();
}

function renderChunksTable() {
  const container = document.getElementById('chunks-container');
  if (chunkData.chunks.length === 0) {
    container.innerHTML = '<div class="empty-state">No chunks found for this filter.</div>';
    return;
  }

  container.innerHTML = `
    <table class="chunks-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Language</th>
          <th>Type</th>
          <th>Text Preview</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${chunkData.chunks.map(c => `
          <tr>
            <td class="text-dim">${c.idx}</td>
            <td><span class="lang-tag lang-${c.language || 'en'}">${(c.language || 'en').toUpperCase()}</span></td>
            <td class="text-dim text-sm">${escHtml(c.source_type || '')}</td>
            <td><div class="chunk-preview" title="${escHtml(c.text)}">${escHtml(c.text.substring(0, 100))}${c.text.length > 100 ? '…' : ''}</div></td>
            <td>
              <button class="btn btn-ghost btn-sm" onclick="openEditModal(${c.idx}, ${JSON.stringify(c.text).replace(/'/g, "&#39;")}, '${escHtml(c.source||'')}', '${escHtml(c.language||'')}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteChunk(${c.idx})">Del</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderPagination() {
  const totalPages = Math.ceil(chunkData.total / CHUNK_LIMIT);
  const pag = document.getElementById('chunk-pagination');
  if (totalPages <= 1) { pag.style.display = 'none'; return; }

  pag.style.display = 'flex';
  document.getElementById('page-info').textContent =
    `Page ${chunkPage + 1} of ${totalPages}  (${chunkData.total} total)`;
  document.getElementById('prev-page-btn').disabled = chunkPage === 0;
  document.getElementById('next-page-btn').disabled = chunkPage >= totalPages - 1;
}

document.getElementById('load-chunks-btn').addEventListener('click', () => loadChunks(true));
document.getElementById('filter-source').addEventListener('change', () => loadChunks(true));
document.getElementById('filter-lang').addEventListener('change', () => loadChunks(true));

document.getElementById('prev-page-btn').addEventListener('click', () => {
  if (chunkPage > 0) { chunkPage--; loadChunks(false); }
});
document.getElementById('next-page-btn').addEventListener('click', () => {
  const totalPages = Math.ceil(chunkData.total / CHUNK_LIMIT);
  if (chunkPage < totalPages - 1) { chunkPage++; loadChunks(false); }
});

document.getElementById('delete-source-btn').addEventListener('click', async () => {
  const source = document.getElementById('filter-source').value;
  if (!source) return;
  if (!confirm(`Delete ALL chunks from source "${source}"? This cannot be undone.`)) return;

  const resp = await fetch(`${API}/chunks/source/${encodeURIComponent(source)}`, { method: 'DELETE' });
  if (resp.ok) {
    const data = await resp.json();
    alert(`Deleted ${data.deleted} chunks from "${source}"`);
    loadSources();
    loadChunks(true);
  } else {
    alert('Delete failed');
  }
});

async function deleteChunk(idx) {
  if (!confirm('Delete this chunk?')) return;
  const resp = await fetch(`${API}/chunks/${idx}`, { method: 'DELETE' });
  if (resp.ok) loadChunks(false);
}

// Edit modal
let editModalIdx = null;

function openEditModal(idx, text, source, lang) {
  editModalIdx = idx;
  document.getElementById('edit-modal-meta').textContent = `Source: ${source} | Language: ${lang} | Index: ${idx}`;
  document.getElementById('edit-modal-text').value = text;
  document.getElementById('edit-modal').classList.add('open');
}

document.getElementById('edit-modal-cancel').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.remove('open');
});

document.getElementById('edit-modal-save').addEventListener('click', async () => {
  const text = document.getElementById('edit-modal-text').value.trim();
  if (!text) { alert('Text cannot be empty'); return; }

  const resp = await fetch(`${API}/chunks/${editModalIdx}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (resp.ok) {
    document.getElementById('edit-modal').classList.remove('open');
    loadChunks(false);
  } else {
    alert('Save failed');
  }
});

// Close modal on overlay click
document.getElementById('edit-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget)
    e.currentTarget.classList.remove('open');
});


// ══════════════════════════════════════════════════════════════════════════════
// TRANSLATE TAB
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById('translate-btn').addEventListener('click', async () => {
  const langs = [...document.querySelectorAll('input[name="tl"]:checked')].map(cb => cb.value);
  if (langs.length === 0) { alert('Select at least one language'); return; }

  const btn = document.getElementById('translate-btn');
  btn.disabled = true;
  btn.textContent = 'Translating...';

  document.getElementById('translate-log-card').style.display = 'block';
  await streamPost(`${API}/translate`, { languages: langs }, 'translate-log', () => {
    btn.disabled = false;
    btn.textContent = 'Translate';
  });
});

document.getElementById('upload-after-translate-btn').addEventListener('click', async () => {
  const btn = document.getElementById('upload-after-translate-btn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';
  document.getElementById('translate-log-card').style.display = 'block';
  await streamPost(`${API}/pinecone/upload`, null, 'translate-log', () => {
    btn.disabled = false;
    btn.textContent = 'Upload to Pinecone';
  });
});


// ══════════════════════════════════════════════════════════════════════════════
// PINECONE TAB
// ══════════════════════════════════════════════════════════════════════════════

async function loadPineconeStats() {
  document.getElementById('stat-total').textContent = '…';
  document.getElementById('stat-index').textContent = '…';
  try {
    const resp = await fetch(`${API}/pinecone/stats`);
    const data = await resp.json();
    document.getElementById('stat-total').textContent = data.total_vectors ?? '—';
    document.getElementById('stat-index').textContent = data.index_name   ?? '—';
  } catch (e) {
    document.getElementById('stat-total').textContent = 'ERR';
  }
}

document.getElementById('refresh-stats-btn').addEventListener('click', loadPineconeStats);

document.getElementById('pinecone-upload-btn').addEventListener('click', async () => {
  const btn = document.getElementById('pinecone-upload-btn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';
  await streamPost(`${API}/pinecone/upload`, null, 'upload-log', () => {
    btn.disabled = false;
    btn.textContent = 'Upload / Sync';
    loadPineconeStats();
  });
});

document.getElementById('del-filter-btn').addEventListener('click', async () => {
  const type  = document.getElementById('del-filter-type').value;
  const value = document.getElementById('del-filter-value').value.trim();
  if (!value) { alert('Enter a filter value'); return; }

  if (!confirm(`Delete all Pinecone vectors where ${type} = "${value}"?`)) return;

  const body = {};
  body[type] = value;

  const resp = await fetch(`${API}/pinecone/filter`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  alert(data.ok ? `Deleted ${data.deleted} vectors` : `Error: ${data.detail}`);
  loadPineconeStats();
});

document.getElementById('pinecone-delete-all-btn').addEventListener('click', async () => {
  if (!confirm('DELETE ALL vectors from Pinecone? This cannot be undone!')) return;
  if (!confirm('Are you absolutely sure? Type OK in the next prompt to confirm.')) return;
  const ans = prompt('Type DELETE ALL to confirm:');
  if (ans !== 'DELETE ALL') { alert('Cancelled'); return; }

  const resp = await fetch(`${API}/pinecone/all`, { method: 'DELETE' });
  const data = await resp.json();
  alert(data.ok ? 'All vectors deleted.' : `Error: ${data.detail}`);
  loadPineconeStats();
});


// ── Utility ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// ══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE STATS
// ══════════════════════════════════════════════════════════════════════════════

const TYPE_COLORS = {
  website:             '#457b9d',
  website_translated:  '#2a5a6a',
  pptx:                '#e63946',
  pptx_translated:     '#8b2229',
  manual:              '#4caf50',
  manual_translated:   '#2a6b2d',
};
const LANG_COLORS = { en: '#1565c0', ta: '#6a1b9a', hi: '#b71c1c', ml: '#1b5e20' };

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function renderBreakdownBars(containerId, data, colors) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  el.innerHTML = entries.map(([key, count]) => {
    const pct   = Math.max(2, Math.round((count / max) * 100));
    const color = colors[key] || '#555';
    return `
      <div class="breakdown-row">
        <span class="breakdown-label">${escHtml(key)}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="breakdown-count">${fmtNum(count)}</span>
      </div>`;
  }).join('');
}

async function loadKbStats() {
  try {
    const resp = await fetch(`${API}/stats`);
    const d    = await resp.json();

    document.getElementById('stat-kb-files').textContent  = d.scraped_files.length;
    document.getElementById('stat-kb-words').textContent  = fmtNum(d.total_scraped_words);
    document.getElementById('stat-kb-chunks').textContent = fmtNum(d.total_chunks);

    const totalKb = d.scraped_files.reduce((s, f) => s + f.size_kb, 0);
    document.getElementById('stat-kb-size').textContent =
      totalKb >= 1024 ? (totalKb / 1024).toFixed(1) + ' MB' : totalKb.toFixed(1) + ' KB';

    // Type breakdown
    if (Object.keys(d.chunks_by_source_type).length > 0) {
      renderBreakdownBars('kb-type-bars', d.chunks_by_source_type, TYPE_COLORS);
      document.getElementById('kb-type-breakdown').style.display = 'block';
    }

    // Language breakdown
    if (Object.keys(d.chunks_by_language).length > 0) {
      renderBreakdownBars('kb-lang-bars', d.chunks_by_language, LANG_COLORS);
      document.getElementById('kb-lang-breakdown').style.display = 'block';
    }

    // Per-file table
    if (d.scraped_files.length > 0) {
      document.getElementById('kb-files-section').style.display = 'block';
      const tbody = document.getElementById('kb-files-tbody');
      tbody.innerHTML = d.scraped_files.map(f => {
        const isSmart = f.file_type === 'smart_json';
        const typeBadge = isSmart
          ? `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:#1a3a2a;color:#81c784">smart</span>`
          : `<span style="font-size:10px;padding:1px 6px;border-radius:3px;background:#1a2a3a;color:#64b5f6">raw</span>`;
        const wordsCol = isSmart
          ? `${f.product_count} products`
          : fmtNum(f.words) + ' words';
        const editFn = isSmart
          ? `openSmartJsonEdit('${escHtml(f.filename)}')`
          : `openScrapedEdit('${escHtml(f.filename)}')`;
        const deleteFn = isSmart
          ? `deleteSmartJson('${escHtml(f.filename)}')`
          : `deleteScrapedFile('${escHtml(f.filename)}')`;

        return `
          <tr>
            <td class="text-dim text-sm" style="white-space:nowrap">${typeBadge} ${escHtml(f.filename)}</td>
            <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              ${f.url
                ? `<a href="${escHtml(f.url)}" target="_blank" style="color:var(--accent2);font-size:11px">${escHtml(f.title || f.url)}</a>`
                : `<span class="text-dim text-sm">${escHtml(f.title || '—')}</span>`
              }
            </td>
            <td class="text-sm">${wordsCol}</td>
            <td class="text-dim">${f.size_kb} KB</td>
            <td>
              <span style="color:${f.chunks > 0 ? 'var(--green)' : 'var(--text-dim)'};font-weight:600">
                ${f.chunks}
              </span>
            </td>
            <td style="white-space:nowrap">
              <button class="btn btn-ghost btn-sm" onclick="${editFn}">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="${deleteFn}">Delete</button>
            </td>
          </tr>`;
      }).join('');
    }
  } catch (e) {
    console.warn('Stats load failed:', e);
  }
}

document.getElementById('refresh-stats-kb-btn').addEventListener('click', loadKbStats);

// ══════════════════════════════════════════════════════════════════════════════
// SCRAPED FILE EDIT / DELETE
// ══════════════════════════════════════════════════════════════════════════════

let _editingScrapedFile = null;

async function openScrapedEdit(filename) {
  const btn = document.querySelector(`button[onclick="openScrapedEdit('${filename}')"]`);
  if (btn) { btn.textContent = 'Loading…'; btn.disabled = true; }

  try {
    const resp = await fetch(`${API}/scraped/${encodeURIComponent(filename)}`);
    if (!resp.ok) { alert('Could not load file'); return; }
    const data = await resp.json();

    _editingScrapedFile = filename;
    document.getElementById('scraped-edit-filename').textContent = filename;
    document.getElementById('scraped-edit-size').textContent     = `${data.size_kb} KB`;
    document.getElementById('scraped-edit-text').value           = data.content;
    document.getElementById('scraped-edit-modal').classList.add('open');
  } finally {
    if (btn) { btn.textContent = 'Edit'; btn.disabled = false; }
  }
}

async function deleteScrapedFile(filename) {
  if (!confirm(`Delete scraped file "${filename}"?\n\nThis removes the raw text. Chunks already processed from it will remain until you re-process.`)) return;

  const resp = await fetch(`${API}/scraped/${encodeURIComponent(filename)}`, { method: 'DELETE' });
  if (resp.ok) {
    loadKbStats();
  } else {
    alert('Delete failed');
  }
}

document.getElementById('scraped-edit-cancel').addEventListener('click', () => {
  document.getElementById('scraped-edit-modal').classList.remove('open');
});


document.getElementById('scraped-edit-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget)
    e.currentTarget.classList.remove('open');
});

// ── Smart JSON edit / delete ──────────────────────────────────────────────────

async function openSmartJsonEdit(filename) {
  const btn = document.querySelector(`button[onclick="openSmartJsonEdit('${filename}')"]`);
  if (btn) { btn.textContent = 'Loading…'; btn.disabled = true; }

  try {
    const resp = await fetch(`${API}/smart-json/${encodeURIComponent(filename)}`);
    if (!resp.ok) { alert('Could not load file'); return; }
    const data = await resp.json();

    _editingScrapedFile = filename;
    document.getElementById('scraped-edit-filename').textContent = filename;
    document.getElementById('scraped-edit-size').textContent =
      `${data.products?.length || 0} products`;
    // Pretty print JSON for editing
    document.getElementById('scraped-edit-text').value =
      JSON.stringify(data, null, 2);
    document.getElementById('scraped-edit-modal').classList.add('open');
    // Mark as smart JSON so save uses correct endpoint
    document.getElementById('scraped-edit-modal').dataset.mode = 'smart';
  } finally {
    if (btn) { btn.textContent = 'Edit'; btn.disabled = false; }
  }
}

async function deleteSmartJson(filename) {
  if (!confirm(`Delete smart JSON file "${filename}"?\n\nChunks already merged from it will remain in knowledge_chunks.json until you re-scrape.`)) return;
  const resp = await fetch(`${API}/smart-json/${encodeURIComponent(filename)}`, { method: 'DELETE' });
  if (resp.ok) loadKbStats();
  else alert('Delete failed');
}

// Override save button to handle both raw .txt and smart JSON
document.getElementById('scraped-edit-save').addEventListener('click', async () => {
  const content = document.getElementById('scraped-edit-text').value;
  const saveBtn = document.getElementById('scraped-edit-save');
  const mode    = document.getElementById('scraped-edit-modal').dataset.mode;
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';

  let endpoint, body, headers;
  if (mode === 'smart') {
    // Validate JSON before saving
    try { JSON.parse(content); } catch (e) {
      alert(`Invalid JSON: ${e.message}`);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
      return;
    }
    endpoint = `${API}/smart-json/${encodeURIComponent(_editingScrapedFile)}`;
    body     = content;   // raw JSON string
    headers  = { 'Content-Type': 'application/json' };
  } else {
    endpoint = `${API}/scraped/${encodeURIComponent(_editingScrapedFile)}`;
    body     = JSON.stringify({ content });
    headers  = { 'Content-Type': 'application/json' };
  }

  const resp = await fetch(endpoint, { method: 'PUT', headers, body });
  saveBtn.disabled = false;
  saveBtn.textContent = 'Save Changes';

  if (resp.ok) {
    document.getElementById('scraped-edit-modal').classList.remove('open');
    document.getElementById('scraped-edit-modal').dataset.mode = '';
    loadKbStats();
  } else {
    alert('Save failed');
  }
}, { once: false });

// ══════════════════════════════════════════════════════════════════════════════
// JSON UPLOAD → CHUNKS
// ══════════════════════════════════════════════════════════════════════════════

let jsonFile = null;

const jsonDropZone  = document.getElementById('json-drop-zone');
const jsonFileInput = document.getElementById('json-file-input');
const jsonImportBtn = document.getElementById('json-import-btn');

jsonDropZone.addEventListener('click', () => jsonFileInput.click());
document.querySelector('.json-browse-link')?.addEventListener('click', (e) => {
  e.stopPropagation(); jsonFileInput.click();
});

jsonDropZone.addEventListener('dragover',  (e) => { e.preventDefault(); jsonDropZone.classList.add('drag-over'); });
jsonDropZone.addEventListener('dragleave', ()  => jsonDropZone.classList.remove('drag-over'));
jsonDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  jsonDropZone.classList.remove('drag-over');
  const f = [...e.dataTransfer.files].find(f => f.name.toLowerCase().endsWith('.json'));
  if (f) setJsonFile(f);
});

jsonFileInput.addEventListener('change', () => {
  if (jsonFileInput.files[0]) setJsonFile(jsonFileInput.files[0]);
  jsonFileInput.value = '';
});

function setJsonFile(f) {
  jsonFile = f;
  const el = document.getElementById('json-file-display');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="pdf-file-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent2)">
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      </svg>
      <span class="pdf-fname">${escHtml(f.name)}</span>
      <span class="pdf-fsize">${(f.size / 1024).toFixed(1)} KB</span>
      <span class="pdf-remove" onclick="clearJsonFile()" title="Remove">×</span>
    </div>`;
  jsonImportBtn.disabled = false;
}

function clearJsonFile() {
  jsonFile = null;
  document.getElementById('json-file-display').style.display = 'none';
  document.getElementById('json-result').style.display = 'none';
  jsonImportBtn.disabled = true;
}

jsonImportBtn.addEventListener('click', async () => {
  if (!jsonFile) return;

  const lang   = document.getElementById('json-lang').value;
  const source = document.getElementById('json-source').value.trim();
  const result = document.getElementById('json-result');

  jsonImportBtn.disabled    = true;
  jsonImportBtn.textContent = 'Importing…';

  const fd = new FormData();
  fd.append('file',        jsonFile);
  fd.append('language',    lang);
  fd.append('source_name', source);

  try {
    const resp = await fetch(`${API}/json/upload`, { method: 'POST', body: fd });
    const data = await resp.json();

    result.style.display = 'block';
    if (resp.ok && data.ok) {
      result.className = 'pdf-result-item pdf-result-ok';
      result.innerHTML = `
        <div class="pdf-result-name">✅ Imported successfully</div>
        <div class="pdf-result-meta">
          Source: <b>${escHtml(data.source)}</b> &nbsp;·&nbsp;
          Language: <b>${escHtml(data.language).toUpperCase()}</b> &nbsp;·&nbsp;
          <b>${data.imported}</b> chunks imported
          ${data.skipped ? `&nbsp;·&nbsp; ${data.skipped} skipped` : ''}
          &nbsp;·&nbsp; Total in KB: <b>${data.total_chunks}</b>
        </div>`;
      clearJsonFile();
      loadKbStats();
      loadSources();
    } else {
      result.className = 'pdf-result-item pdf-result-err';
      result.innerHTML = `<div class="pdf-result-name">✗ Import failed</div>
                          <div class="pdf-result-meta">${escHtml(data.detail || 'Unknown error')}</div>`;
    }
  } catch (e) {
    result.style.display = 'block';
    result.className = 'pdf-result-item pdf-result-err';
    result.innerHTML = `<div class="pdf-result-name">✗ Error</div>
                        <div class="pdf-result-meta">${escHtml(e.message)}</div>`;
  }

  jsonImportBtn.disabled    = false;
  jsonImportBtn.textContent = 'Import as Chunks';
});

// ══════════════════════════════════════════════════════════════════════════════
// PDF UPLOAD & EXTRACT
// ══════════════════════════════════════════════════════════════════════════════

let pdfFiles = [];

const pdfDropZone  = document.getElementById('pdf-drop-zone');
const pdfFileInput = document.getElementById('pdf-file-input');
const pdfUploadBtn = document.getElementById('pdf-upload-btn');

// Open file picker on click
pdfDropZone.addEventListener('click', () => pdfFileInput.click());

// Browse link inside the zone
document.querySelector('.pdf-browse-link')?.addEventListener('click', (e) => {
  e.stopPropagation();
  pdfFileInput.click();
});

// Drag & drop
pdfDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  pdfDropZone.classList.add('drag-over');
});
pdfDropZone.addEventListener('dragleave', () => pdfDropZone.classList.remove('drag-over'));
pdfDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  pdfDropZone.classList.remove('drag-over');
  addPdfFiles([...e.dataTransfer.files]);
});

pdfFileInput.addEventListener('change', () => {
  addPdfFiles([...pdfFileInput.files]);
  pdfFileInput.value = '';
});

function addPdfFiles(files) {
  const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
  pdfs.forEach(f => {
    if (!pdfFiles.find(e => e.name === f.name)) pdfFiles.push(f);
  });
  renderPdfFileList();
}

function removePdfFile(name) {
  pdfFiles = pdfFiles.filter(f => f.name !== name);
  renderPdfFileList();
}

function renderPdfFileList() {
  const el = document.getElementById('pdf-file-list');
  if (pdfFiles.length === 0) {
    el.style.display = 'none';
    pdfUploadBtn.disabled = true;
    return;
  }
  el.style.display = 'block';
  pdfUploadBtn.disabled = false;
  el.innerHTML = pdfFiles.map(f => `
    <div class="pdf-file-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      </svg>
      <span class="pdf-fname">${escHtml(f.name)}</span>
      <span class="pdf-fsize">${(f.size / 1024).toFixed(1)} KB</span>
      <span class="pdf-remove" onclick="removePdfFile('${escHtml(f.name)}')" title="Remove">×</span>
    </div>
  `).join('');
}

pdfUploadBtn.addEventListener('click', async () => {
  if (pdfFiles.length === 0) return;

  const lang    = document.getElementById('pdf-lang').value;
  const results = document.getElementById('pdf-results');
  results.style.display = 'block';
  results.innerHTML     = '';

  pdfUploadBtn.disabled    = true;
  pdfUploadBtn.textContent = 'Extracting…';

  for (const file of pdfFiles) {
    const fd = new FormData();
    fd.append('file',     file);
    fd.append('language', lang);

    const item = document.createElement('div');
    item.className = 'pdf-result-item';
    item.innerHTML = `<div class="pdf-result-name">${escHtml(file.name)}</div>
                      <div class="pdf-result-meta">Uploading…</div>`;
    results.appendChild(item);

    try {
      const resp = await fetch(`${API}/pdf/upload`, { method: 'POST', body: fd });
      const data = await resp.json();

      if (resp.ok && data.ok) {
        item.className = 'pdf-result-item pdf-result-ok';
        item.innerHTML = `
          <div class="pdf-result-name">✅ ${escHtml(data.original)} → ${escHtml(data.filename)}</div>
          <div class="pdf-result-meta">
            ${data.extracted}/${data.total_pages} pages extracted &nbsp;·&nbsp;
            ${fmtNum(data.total_words)} words &nbsp;·&nbsp;
            ${data.size_kb} KB saved
            ${data.failed_pages.length ? `&nbsp;·&nbsp; ⚠ failed pages: ${data.failed_pages.join(', ')}` : ''}
          </div>`;
      } else {
        item.className = 'pdf-result-item pdf-result-err';
        item.innerHTML = `<div class="pdf-result-name">✗ ${escHtml(file.name)}</div>
                          <div class="pdf-result-meta">${escHtml(data.detail || 'Unknown error')}</div>`;
      }
    } catch (e) {
      item.className = 'pdf-result-item pdf-result-err';
      item.innerHTML = `<div class="pdf-result-name">✗ ${escHtml(file.name)}</div>
                        <div class="pdf-result-meta">${escHtml(e.message)}</div>`;
    }
  }

  pdfUploadBtn.disabled    = false;
  pdfUploadBtn.textContent = 'Extract & Save';
  pdfFiles = [];
  renderPdfFileList();
  loadKbStats();   // refresh stats table
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadUrls();
loadKbStats();
