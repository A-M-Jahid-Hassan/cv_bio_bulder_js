# Quick Reference

## Run Locally

```bash
# From the project root
python3 -m http.server 8080
# Open: http://localhost:8080
```

Other options:
```bash
npx serve .          # if Node.js is installed
php -S localhost:8080 # if PHP is installed
```

> ⚠️ Must use an HTTP server. Opening index.html as file:// breaks fetch().

---

## Add a New Template (3-minute process)

```bash
# 1. Create folder
mkdir templates/my_template

# 2. Create the 4 required files
touch templates/my_template/{config.json,form.html,template.html,style.css}

# 3. Register it (add one object to the array)
# edit templates/registry.json

# 4. Fill in the 4 files (see adding-templates.md for full guide)
```

---

## Placeholder Format

In `template.html`, use double curly braces:

```
{{field_name}}
```

The `field_name` must exactly match the `name=` attribute in `form.html`.

---

## Form Layout Cheatsheet

```html
<!-- Full-width input -->
<div class="form-group">
  <label for="x">Label</label>
  <input type="text" id="x" name="x" placeholder="...">
</div>

<!-- Two inputs side by side -->
<div class="form-row">
  <div class="form-group">...</div>
  <div class="form-group">...</div>
</div>

<!-- Dropdown -->
<div class="form-group">
  <label for="y">Label</label>
  <select id="y" name="y">
    <option value="">Select</option>
    <option value="A">Option A</option>
  </select>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="z">Label</label>
  <textarea id="z" name="z" rows="3"></textarea>
</div>

<!-- Named subsection (e.g. "Experience 1") -->
<div class="form-subsection">
  <p class="subsection-label">Experience 1</p>
  <!-- form-groups here -->
</div>
```

---

## CSS Color Variables (use in template styles)

```css
/* App colors — available globally */
--color-primary:      #2563EB   /* blue */
--color-accent:       #10B981   /* green */
--color-text:         #1F2937   /* near-black */
--color-text-muted:   #6B7280   /* grey */
--color-border:       #E5E7EB   /* light grey */
--color-bg:           #F8FAFC   /* off-white */
```

---

## Module API (call from app.js or console)

```js
// State
StateManager.getState()               // → { templateId, templateConfig, formData }
StateManager.updateFormData(key, val) // update one field
StateManager.resetAll()               // clear everything

// Router
Router.navigate('templates')          // go to a page
// pages: 'landing' | 'templates' | 'builder' | 'preview'

// Template Loader
await TemplateLoader.loadRegistry()   // → array of template objects
await TemplateLoader.loadTemplate(id) // → config object, injects CSS
TemplateLoader.getFormHtml()          // → raw form HTML string
TemplateLoader.getTemplateHtml()      // → raw template HTML string

// Preview
PreviewEngine.setTemplateHtml(html)   // set which template to render
PreviewEngine.update()                // re-render with current state

// PDF
PdfGenerator.generate(element, 'filename.pdf')
```

---

## Project Structure

```
/
├── index.html
├── assets/
│   ├── css/
│   │   ├── theme.css        ← CSS variables (colors, spacing, fonts)
│   │   ├── main.css         ← base reset, buttons, forms, cards
│   │   ├── layout.css       ← navbar, pages, builder, preview layouts
│   │   └── responsive.css   ← breakpoints (mobile/tablet/desktop)
│   └── js/
│       ├── stateManager.js
│       ├── router.js
│       ├── templateLoader.js
│       ├── previewEngine.js
│       ├── formBinder.js
│       ├── pdfGenerator.js
│       └── app.js
├── templates/
│   ├── registry.json        ← master list of templates
│   ├── marriage_bio_1/
│   └── cv_1/
└── documentation/
    ├── quick-reference.md   ← this file
    ├── adding-templates.md  ← full guide to adding templates
    └── architecture.md      ← how the app is structured internally
```
