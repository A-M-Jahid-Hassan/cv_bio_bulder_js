/* ============================================================
   formBinder.js — Attach listeners, push to state, trigger preview
   Depends on: StateManager, PreviewEngine
   ============================================================ */

const FormBinder = (() => {
  function bind(containerEl) {
    const inputs = containerEl.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input',  _handleChange);
      input.addEventListener('change', _handleChange);
    });
  }

  /** Repopulate form fields from saved state (used when returning to builder) */
  function restore(containerEl, formData) {
    Object.keys(formData).forEach(key => {
      const el = containerEl.querySelector(`[name="${key}"]`);
      if (el) el.value = formData[key] || '';
    });
  }

  function _handleChange(e) {
    const { name, value } = e.target;
    if (!name) return;
    StateManager.updateFormData(name, value);
    PreviewEngine.update();
  }

  return { bind, restore };
})();
