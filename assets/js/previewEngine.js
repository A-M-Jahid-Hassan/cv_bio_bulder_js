/* ============================================================
   previewEngine.js — Render template with current state
   Depends on: StateManager
   ============================================================ */

const PreviewEngine = (() => {
  let _templateHtml = '';

  function setTemplateHtml(html) {
    _templateHtml = html;
  }

  function render(containerEl) {
    if (!_templateHtml) return;

    const { formData } = StateManager.getState();
    let rendered = _templateHtml;

    Object.keys(formData).forEach(key => {
      const value = formData[key] || '';
      // Escape HTML to prevent XSS from form inputs
      const safe = _escapeHtml(value);
      rendered = rendered.split(`{{${key}}}`).join(safe);
    });

    // Clear any remaining unfilled placeholders
    rendered = rendered.replace(/\{\{[^}]+\}\}/g, '');

    containerEl.innerHTML = rendered;
  }

  function update() {
    const el = document.getElementById('preview-content');
    if (el) render(el);
  }

  function _escapeHtml(str) {
    return str
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;')
      .replace(/\n/g, '<br>');
  }

  return { setTemplateHtml, render, update };
})();
