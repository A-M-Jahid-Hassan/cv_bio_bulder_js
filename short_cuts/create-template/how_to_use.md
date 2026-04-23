# create-template — How to Use

Scaffolds a new boilerplate template folder inside `templates/` and registers it in `registry.json` automatically.

---

## Pick your script

| You have | Command |
|----------|---------|
| Python 3 | `python3 short_cuts/create-template/create-template.py` |
| Node.js  | `node short_cuts/create-template/create-template.js`    |

> Run both commands from the **project root** (`/bio/`), not from inside the `short_cuts` folder.

**Windows** — same commands, just flip the slashes:
```
python short_cuts\create-template\create-template.py
```

---

## What it asks you

```
Template display name : Marriage Biodata Modern
Template ID           : marriage_biodata_modern   ← auto-suggested, press Enter to accept
Short description     : A modern take on the classic format
Category              : marriage
PDF output filename   : marriage_biodata_modern.pdf
```

| Field | What it does |
|-------|-------------|
| **Display name** | Shown on the template card in the browser |
| **Template ID** | Folder name — lowercase, underscores only |
| **Description** | One-line subtitle on the card |
| **Category** | `marriage` 💍 · `cv` 📄 · anything else 📋 |
| **PDF filename** | Name of the downloaded PDF file |

---

## What gets created

```
templates/
└── marriage_biodata_modern/
    ├── config.json      ← field list (edit to add/remove fields)
    ├── form.html        ← the form users fill in
    ├── template.html    ← the output document (uses {{field_name}} placeholders)
    └── style.css        ← print/preview styles, scoped to this template

templates/registry.json  ← updated automatically
```

All 4 files are pre-filled with working boilerplate — they render immediately in the browser. You edit them to build your actual template.

---

## After running

1. Reload `http://localhost:8080/templates.html` — the new card appears instantly.
2. Open the 4 generated files and customise:
   - Add fields to `config.json`
   - Mirror those fields as inputs in `form.html` (keep `name=` matching)
   - Place `{{field_name}}` placeholders in `template.html`
   - Style everything in `style.css`

For the complete field reference and layout class list, see [`documentation/adding-templates.md`](../../documentation/adding-templates.md).
