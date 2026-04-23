/* ============================================================
   templateLoader.js — Fetch and cache template assets
   No dependencies.
   ============================================================ */

const TemplateLoader = (() => {
  let _templateHtml = '';
  let _formHtml = '';
  let _styleEl = null;

  async function loadRegistry() {
    const res = await fetch('templates/registry.json');
    if (!res.ok) throw new Error('Failed to load template registry');
    return res.json();
  }

  async function loadTemplate(id) {
    const [configRes, formRes, templateRes, styleRes] = await Promise.all([
      fetch(`templates/${id}/config.json`),
      fetch(`templates/${id}/form.html`),
      fetch(`templates/${id}/template.html`),
      fetch(`templates/${id}/style.css`)
    ]);

    if (!configRes.ok || !formRes.ok || !templateRes.ok || !styleRes.ok) {
      throw new Error(`Failed to load template "${id}"`);
    }

    const config = await configRes.json();
    _formHtml = await formRes.text();
    _templateHtml = await templateRes.text();
    const css = await styleRes.text();

    _injectStyle(css);
    return config;
  }

  function _injectStyle(css) {
    if (_styleEl) _styleEl.remove();
    _styleEl = document.createElement('style');
    _styleEl.id = 'template-style';
    _styleEl.textContent = css;
    document.head.appendChild(_styleEl);
  }

  function getTemplateHtml() { return _templateHtml; }
  function getFormHtml()     { return _formHtml; }

  return { loadRegistry, loadTemplate, getTemplateHtml, getFormHtml };
})();
