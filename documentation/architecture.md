# Architecture Overview

## Application Type
Static SPA (Single Page Application) — no backend, no build step, no framework.

---

## Data Flow (one-directional, never reversed)

```
User types in form
       │
       ▼
  FormBinder.bind()
  (listens: input / change events)
       │
       ▼
  StateManager.updateFormData(key, value)
  (updates the single state object)
       │
       ▼
  PreviewEngine.update()
  (replaces {{placeholders}} in template HTML)
       │
       ▼
  DOM update
  (preview-content innerHTML updated)
```

State is **never read back from the DOM**. The DOM is output-only.

---

## Pages (hash-based routing)

| Hash         | Page shown        | Trigger                        |
|--------------|-------------------|--------------------------------|
| `#landing`   | Landing / About   | Default, or "About" nav link   |
| `#templates` | Template list     | "Biodata" nav link, Get Started |
| `#builder`   | Form + Preview    | Clicking a template card       |
| `#preview`   | Full-screen PDF   | "Preview PDF →" button         |

Router is in `assets/js/router.js`. Navigation: `Router.navigate('builder')`.

---

## Module Map

```
assets/js/
├── stateManager.js    ← state object, no deps
├── router.js          ← hash routing, no deps
├── templateLoader.js  ← fetch() calls, no deps
├── previewEngine.js   ← depends on StateManager
├── formBinder.js      ← depends on StateManager + PreviewEngine
├── pdfGenerator.js    ← depends on html2pdf (CDN)
└── app.js             ← orchestrates all of the above
```

Scripts are loaded in this exact order in `index.html` so each module's
dependencies are already defined when it runs.

---

## Template System

```
templates/
├── registry.json              ← master list of all templates
├── marriage_bio_1/
│   ├── config.json            ← field definitions
│   ├── form.html              ← form UI (injected into builder)
│   ├── template.html          ← output document ({{placeholders}})
│   └── style.css              ← scoped styles (injected into <head>)
└── cv_1/
    └── ...
```

Loading sequence when a user picks a template:

```
1. fetch config.json     → StateManager.setTemplate(id, config)
2. fetch form.html       → injected into #form-container
3. fetch template.html   → PreviewEngine.setTemplateHtml(html)
4. fetch style.css       → injected as <style id="template-style"> in <head>
5. FormBinder.bind()     → attaches listeners to all form inputs
6. PreviewEngine.update()→ renders empty preview
```

---

## State Shape

```js
{
  templateId:     "marriage_bio_1",   // string | null
  templateConfig: { id, name, pdfFilename, fields: [...] },
  formData: {
    full_name:  "John Doe",
    dob:        "1990-01-01",
    // ...one key per form field
  }
}
```

---

## File Count by Role

| Role            | Files |
|-----------------|-------|
| Entry point     | `index.html` |
| CSS modules     | `theme.css`, `main.css`, `layout.css`, `responsive.css` |
| JS modules      | `stateManager`, `router`, `templateLoader`, `previewEngine`, `formBinder`, `pdfGenerator`, `app` |
| Template (each) | `config.json`, `form.html`, `template.html`, `style.css` |
| Registry        | `templates/registry.json` |

---

## Deployment

The app is a plain static site. Just upload the project root to:
- **Netlify** — drag & drop the folder, or connect a Git repo
- **GitHub Pages** — push to a repo, enable Pages from the root of `main`
- **Any static host** — Apache, Nginx, Vercel, Cloudflare Pages

The only external dependency is the `html2pdf.js` CDN (for PDF export).
All other code is local.
