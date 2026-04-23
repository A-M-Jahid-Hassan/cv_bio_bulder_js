# Biodata Builder

A fully client-side biodata and CV builder with live preview and one-click PDF download. No backend, no database, no build step — just open and use.

## Features

- Fill a form, see a live preview update in real time
- Download your biodata as a print-ready A4 PDF
- Multiple templates (marriage biodata, CV, and more)
- Works offline — all dependencies are either bundled or loaded from CDN on demand

## Getting Started

Because the app uses `fetch()` to load template files, you must serve it over HTTP — opening `index.html` directly as a `file://` URL will not work.

**Python (recommended):**
```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

**Node.js:**
```bash
npx serve .
```

## Project Structure

```
bio/
├── index.html              # Landing page
├── templates.html          # Template picker
├── builder.html            # Form + live preview
├── preview.html            # Full-screen preview
├── assets/
│   ├── css/                # Global styles (layout, theme, responsive)
│   ├── js/                 # Core modules (see Architecture below)
│   └── libs/               # Bundled html2pdf.js
├── templates/
│   ├── registry.json       # List of all available templates
│   └── <template-id>/      # One folder per template
│       ├── config.json     # Field definitions
│       ├── form.html       # Input form
│       ├── template.html   # Output document with {{placeholders}}
│       └── style.css       # Template-scoped styles
├── short_cuts/
│   └── create-template/    # Scaffold script for new templates
└── documentation/          # Architecture and template authoring docs
```

## Architecture

All modules are vanilla JS (no frameworks), loaded in this order:

```
stateManager → router → templateLoader → previewEngine → formBinder → pdfGenerator → app
```

Data flows one way: **User Input → FormBinder → StateManager → PreviewEngine → DOM**

| Module | Responsibility |
|---|---|
| `stateManager.js` | Single state object `{ templateId, templateConfig, formData }` |
| `router.js` | Hash-based navigation between pages |
| `templateLoader.js` | Fetches the 4 template files from `templates/<id>/` |
| `previewEngine.js` | Replaces `{{key}}` placeholders in template.html, XSS-safe |
| `formBinder.js` | Attaches input listeners; calls StateManager + PreviewEngine |
| `pdfGenerator.js` | Wraps html2pdf.js for A4 PDF export |
| `app.js` | Orchestrates all modules and sets up event listeners |

## Adding a New Template

Use the scaffold script from the project root:

```bash
# Python
python3 short_cuts/create-template/create-template.py

# Node.js
node short_cuts/create-template/create-template.js
```

The script asks a few questions (name, ID, category, PDF filename) and generates all 4 template files plus updates `registry.json` automatically. The new template card appears on the templates page immediately after a page reload.

Then edit the generated files:
1. Add fields to `config.json`
2. Add matching `<input name="field_name">` elements to `form.html`
3. Place `{{field_name}}` placeholders in `template.html`
4. Style everything in `style.css`

See [documentation/adding-templates.md](documentation/adding-templates.md) for the full field reference.

## Available Templates

| ID | Name | Category |
|---|---|---|
| `bio_data_mordern_1` | Bio Data - Modern | Marriage |

## Deployment

The entire project is a static site. Drop the folder into any static host:

- **Netlify** — drag and drop the folder in the Netlify dashboard
- **GitHub Pages** — push to a repo and enable Pages in Settings
- **Any web server** — just serve the root directory

No build step required.
