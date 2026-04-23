/* ============================================================
   app.js — Page bootstrap: detects current page and initialises it
   Depends on: StateManager, Router, TemplateLoader,
               PreviewEngine, FormBinder, PdfGenerator
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  _setupNavbar();
  Router.markActiveLink();

  const page = document.body.dataset.page;
  const init = {
    landing:   _initLanding,
    templates: _initTemplates,
    builder:   _initBuilder,
    preview:   _initPreview
  };

  if (init[page]) init[page]();
});

/* ── Navbar ─────────────────────────────────────────────── */

function _setupNavbar() {
  const toggle = document.getElementById('navbar-toggle');
  const links  = document.getElementById('navbar-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

/* ── Landing ─────────────────────────────────────────────── */

function _initLanding() {
  document.getElementById('btn-get-started')
    .addEventListener('click', () => Router.toTemplates());
}

/* ── Templates ───────────────────────────────────────────── */

async function _initTemplates() {
  const grid = document.getElementById('templates-grid');

  grid.innerHTML = `
    <div class="loading-placeholder">
      <div class="spinner"></div><p>Loading templates…</p>
    </div>`;

  try {
    const registry = await TemplateLoader.loadRegistry();
    grid.innerHTML = '';
    registry.forEach(tpl => grid.appendChild(_makeCard(tpl)));
  } catch (err) {
    grid.innerHTML = `
      <div class="loading-placeholder">
        <p style="color:var(--color-danger)">
          Failed to load templates.<br>
          <small>Serve via HTTP — not file://</small>
        </p>
      </div>`;
  }
}

function _makeCard(tpl) {
  const ICONS = { marriage: '💍', cv: '📄' };
  const icon  = ICONS[tpl.category] || '📋';

  const card = document.createElement('div');
  card.className = 'template-card';
  card.innerHTML = `
    <div class="template-card-preview">
      <div class="template-card-icon">${icon}</div>
    </div>
    <div class="template-card-info">
      <h3>${_esc(tpl.name)}</h3>
      <p>${_esc(tpl.description || '')}</p>
      <button class="btn btn-primary" style="width:100%">Use Template →</button>
    </div>`;

  card.querySelector('button').addEventListener('click', () => {
    StateManager.resetAll();
    Router.toBuilder(tpl.id);
  });
  return card;
}

/* ── Builder ─────────────────────────────────────────────── */

async function _initBuilder() {
  const id = Router.getParam('id');
  if (!id) { Router.toTemplates(); return; }

  _showLoader(true);

  try {
    const config = await TemplateLoader.loadTemplate(id);
    StateManager.setTemplate(id, config);

    // Inject form HTML
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = TemplateLoader.getFormHtml();

    // Prime preview engine
    PreviewEngine.setTemplateHtml(TemplateLoader.getTemplateHtml());

    // Restore saved values if user is returning from preview
    const { formData } = StateManager.getState();
    if (Object.keys(formData).length) {
      FormBinder.restore(formContainer, formData);
    }

    // Initial preview render
    PreviewEngine.update();

    // Wire form inputs → state → preview
    FormBinder.bind(formContainer);

    // Update title
    document.getElementById('builder-template-name').textContent = config.name;

  } catch (err) {
    alert('Failed to load template: ' + err.message);
    Router.toTemplates();
  } finally {
    _showLoader(false);
  }

  // Builder controls
  document.getElementById('btn-back-to-templates')
    .addEventListener('click', () => Router.toTemplates());

  document.getElementById('btn-go-to-preview')
    .addEventListener('click', () => Router.toPreview());
}

/* ── Preview ─────────────────────────────────────────────── */

async function _initPreview() {
  const { templateId, formData } = StateManager.getState();
  if (!templateId) { Router.toTemplates(); return; }

  _showLoader(true);

  try {
    const config = await TemplateLoader.loadTemplate(templateId);
    PreviewEngine.setTemplateHtml(TemplateLoader.getTemplateHtml());

    // Temporarily restore formData so PreviewEngine can render
    Object.keys(formData).forEach(k => StateManager.updateFormData(k, formData[k]));

    const container = document.getElementById('final-preview-content');
    PreviewEngine.render(container);

  } catch (err) {
    alert('Failed to render preview: ' + err.message);
    Router.toTemplates();
    return;
  } finally {
    _showLoader(false);
  }

  document.getElementById('btn-edit-again')
    .addEventListener('click', () => {
      const { templateId: id } = StateManager.getState();
      Router.toBuilder(id);
    });

  document.getElementById('btn-download-pdf')
    .addEventListener('click', () => {
      const el       = document.getElementById('final-preview-content');
      const config   = StateManager.getState().templateConfig;
      const filename = (config && config.pdfFilename) || 'biodata.pdf';
      PdfGenerator.generate(el, filename);
    });
}

/* ── Helpers ─────────────────────────────────────────────── */

function _showLoader(visible) {
  const el = document.getElementById('loader');
  if (el) el.classList.toggle('hidden', !visible);
}

function _esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
