/* ============================================================
   stateManager.js — Single source of truth, persisted to sessionStorage
   No dependencies.
   ============================================================ */

const StateManager = (() => {
  const KEY = 'biodata_state';

  const state = {
    templateId:     null,
    templateConfig: null,
    formData:       {}
  };

  function _save() {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  }

  function _load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(state, parsed);
      }
    } catch (e) { /* corrupted storage — ignore */ }
  }

  // Restore on module init so any page can access saved state immediately
  _load();

  return {
    getState() { return state; },

    setTemplate(id, config) {
      state.templateId     = id;
      state.templateConfig = config;
      _save();
    },

    updateFormData(key, value) {
      state.formData[key] = value;
      _save();
    },

    resetFormData() {
      state.formData = {};
      _save();
    },

    resetAll() {
      state.templateId     = null;
      state.templateConfig = null;
      state.formData       = {};
      _save();
    }
  };
})();
