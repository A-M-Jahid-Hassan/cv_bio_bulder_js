# How to Add a New Template

Adding a new template requires **zero changes to any core JS file**.
You only need to create a folder and add one line to `registry.json`.

---

## Step 1 — Create the template folder

```
templates/
└── your_template_id/       ← folder name = template ID (use lowercase_underscores)
    ├── config.json
    ├── form.html
    ├── template.html
    └── style.css
```

Run this to scaffold the folder:

```bash
mkdir templates/your_template_id
touch templates/your_template_id/{config.json,form.html,template.html,style.css}
```

---

## Step 2 — Register it in `registry.json`

Open `templates/registry.json` and add one object to the array:

```json
[
  { "id": "marriage_bio_1", "name": "Marriage Biodata Classic", "description": "...", "category": "marriage" },
  { "id": "cv_1",           "name": "Professional CV",          "description": "...", "category": "cv"       },

  {
    "id":          "your_template_id",
    "name":        "Display Name Shown in UI",
    "description": "One-line description shown on the card",
    "category":    "marriage"
  }
]
```

**`category`** controls the card icon in the UI:
| category   | icon |
|------------|------|
| `marriage` | 💍   |
| `cv`       | 📄   |
| anything else | 📋 |

---

## Step 3 — Write `config.json`

Defines the template's metadata and full field list.

```json
{
  "id":          "your_template_id",
  "name":        "Display Name",
  "pdfFilename": "output.pdf",
  "fields": [
    { "name": "full_name",   "label": "Full Name",    "type": "text"     },
    { "name": "dob",         "label": "Date of Birth","type": "date"     },
    { "name": "gender",      "label": "Gender",       "type": "select",
      "options": ["Male", "Female", "Other"] },
    { "name": "bio",         "label": "Short Bio",    "type": "textarea" }
  ]
}
```

### Supported field types

| `type`     | HTML element rendered       |
|------------|-----------------------------|
| `text`     | `<input type="text">`       |
| `date`     | `<input type="date">`       |
| `email`    | `<input type="email">`      |
| `tel`      | `<input type="tel">`        |
| `number`   | `<input type="number">`     |
| `select`   | `<select>` (needs `options` array) |
| `textarea` | `<textarea>`                |

> **Rule:** every `"name"` in `config.json` must have a matching `name=` attribute
> in `form.html` AND a matching `{{name}}` placeholder in `template.html`.

---

## Step 4 — Write `form.html`

This is the form users fill in. It's a plain HTML **fragment** (no `<html>/<body>` tags).

- Use `.form-section` + `.form-section-title` for grouped sections
- Use `.form-row` for side-by-side fields
- Use `.form-group` for each label + input pair
- The `name=` attribute on every input **must exactly match** the field name in `config.json`

```html
<div class="form-wrapper">
  <h2 class="form-main-title">Your Template Name</h2>

  <div class="form-section">
    <h3 class="form-section-title">Section One</h3>

    <div class="form-group">
      <label for="full_name">Full Name</label>
      <input type="text" id="full_name" name="full_name" placeholder="Enter name">
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="dob">Date of Birth</label>
        <input type="date" id="dob" name="dob">
      </div>
      <div class="form-group">
        <label for="gender">Gender</label>
        <select id="gender" name="gender">
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label for="bio">Short Bio</label>
      <textarea id="bio" name="bio" rows="4" placeholder="Write a short bio..."></textarea>
    </div>
  </div>
</div>
```

### Form layout classes (from `main.css`)

| Class              | Purpose                                    |
|--------------------|--------------------------------------------|
| `.form-wrapper`    | Outer padding wrapper                      |
| `.form-main-title` | Large heading at top of form               |
| `.form-section`    | Groups related fields with bottom margin   |
| `.form-section-title` | Blue label bar for a group             |
| `.form-subsection` | Bordered box inside a section (e.g. Exp 1) |
| `.subsection-label`| Small uppercase label inside subsection    |
| `.form-group`      | Wraps one label + input pair               |
| `.form-row`        | Two-column grid row (collapses on mobile)  |

---

## Step 5 — Write `template.html`

This is the **output document** — what users see in the preview and what gets exported to PDF.
It's also a plain HTML fragment.

Use `{{field_name}}` anywhere you want the user's input to appear.

```html
<div class="my-template">

  <div class="my-header">
    <h1>{{full_name}}</h1>
    <p>{{dob}} · {{gender}}</p>
  </div>

  <div class="my-section">
    <h2>About</h2>
    <p>{{bio}}</p>
  </div>

</div>
```

### Placeholder rules
- Format: `{{field_name}}` — double curly braces, no spaces
- Name must match the `name=` in `form.html` exactly
- Unfilled placeholders are replaced with an empty string (no error)
- Multi-line textarea values render with `<br>` line breaks automatically

---

## Step 6 — Write `style.css`

Style the output document. Scope everything under your root class (`.my-template`)
so styles don't leak into the app UI.

```css
/* Scoped to your template only */
.my-template {
  font-family: 'Georgia', serif;
  font-size: 13px;
  color: #1a1a1a;
  background: #fff;
  padding: 32px;
  max-width: 720px;
  margin: 0 auto;
}

.my-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.my-header h1 {
  font-size: 24px;
  margin: 0;
}

.my-section h2 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
  margin: 16px 0 8px;
}
```

### PDF-friendly tips
- Keep `max-width` around `680–760px` for clean A4 output
- Avoid `position: fixed` or `vh/vw` units
- Prefer `px` over `rem` inside the template for predictable PDF rendering
- Avoid heavy gradients/shadows — they can be slow in html2pdf

---

## Done — that's it.

Reload `http://localhost:8080` and your template will appear in the list automatically.

No JS changes needed.

---

## Full checklist

- [ ] Folder created: `templates/your_template_id/`
- [ ] Entry added to `templates/registry.json`
- [ ] `config.json` — all field names listed
- [ ] `form.html` — every `name=` matches a field in config
- [ ] `template.html` — every `{{placeholder}}` matches a field in config
- [ ] `style.css` — scoped under a root class
- [ ] Refreshed browser and template appears in the list
