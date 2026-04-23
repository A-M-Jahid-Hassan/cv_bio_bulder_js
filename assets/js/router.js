/* ============================================================
   router.js — Multi-page navigation helpers
   No dependencies.
   ============================================================ */

const Router = {
  toLanding()       { window.location.href = 'index.html'; },
  toTemplates()     { window.location.href = 'templates.html'; },
  toBuilder(id)     { window.location.href = `builder.html?id=${encodeURIComponent(id)}`; },
  toPreview()       { window.location.href = 'preview.html'; },

  getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  },

  /** Highlight the nav link matching the current page filename */
  markActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === current);
    });
  }
};
