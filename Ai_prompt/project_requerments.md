# 📄 Biodata Builder Web App — AI Implementation Blueprint

---

## 1. 🎯 Core Objective

Build a **fully responsive static web application** that allows users to:

- Select a biodata template
- Fill out a dynamic form
- See a **live preview**
- Generate and download a **PDF biodata**

### ⚠️ Constraints:

- No backend
- No database
- Fully static (deployable on Netlify / GitHub Pages)
- Templates must be **modular and easily extendable**

---

## 2. 🧠 AI Execution Rules (CRITICAL)

If you are an AI implementing this system:

### Core Rules:

1. NEVER break the main flow:
   Template নির্বাচন → Form পূরণ → Live Preview → PDF → Download/Edit

2. If stuck or confused:
   - Re-read:
     - Core Objective
     - User Flow
     - Template System
   - Then retry from the last stable step

3. Build incrementally:
   - Step 1: Layout
   - Step 2: Template Loader
   - Step 3: Form Binding
   - Step 4: Live Preview Engine
   - Step 5: PDF Export

4. Avoid overengineering:
   - Prefer Vanilla JS
   - No unnecessary frameworks
   - Keep modules small and independent

---

## 3. 🧩 High-Level Architecture

### Type:

- Static SPA (Single Page Application)

### Tech Stack:

- HTML5
- CSS3 (CSS Variables + Flexbox/Grid)
- Vanilla JavaScript (ES6+)

### Optional Libraries:

- html2pdf.js → PDF generation
- Handlebars.js (optional) → templating

---

## 4. 📁 File Structure (Improved & Scalable)

root/
│
├── index.html
├── assets/
│ ├── css/
│ │ ├── main.css
│ │ ├── layout.css
│ │ ├── responsive.css
│ │ └── theme.css
│ │
│ ├── js/
│ │ ├── app.js
│ │ ├── router.js
│ │ ├── templateLoader.js
│ │ ├── formBinder.js
│ │ ├── previewEngine.js
│ │ ├── pdfGenerator.js
│ │ └── stateManager.js
│ │
│ └── libs/
│ └── html2pdf.bundle.min.js
│
├── templates/
│ ├── marriage_bio_1/
│ │ ├── config.json
│ │ ├── form.html
│ │ ├── template.html
│ │ └── style.css
│ │
│ ├── cv_1/
│ │ ├── config.json
│ │ ├── form.html
│ │ ├── template.html
│ │ └── style.css
│ │
│ └── registry.json
│
└── components/
├── navbar.html
├── template-card.html
└── loader.html

---

## 5. 🧭 User Flow (STRICT)

### Step 1: Landing Page

- Navbar:
  - Biodata
  - About
- Intro section explaining the product

---

### Step 2: Template List Page

- Display all templates from registry.json
- Each template shown as a card
- Click → open builder

---

### Step 3: Builder Page (Core UI)

#### Desktop Layout:

| Form (Left) | Preview (Right) |

#### Mobile Layout:

Form (Top)  
Preview (Bottom)

---

### Step 4: Live Preview

- As user types → preview updates instantly
- No reload

---

### Step 5: Preview Mode

- Button: "Generate PDF Preview"
- Hide form
- Show only final template

Options:

- Download PDF
- Edit Again

---

## 6. 🧱 Template System (IMPORTANT)

Each template must be self-contained.

### config.json

Example:

{
"id": "marriage_bio_1",
"name": "Marriage Biodata Classic",
"fields": [
{ "name": "full_name", "label": "Full Name", "type": "text" },
{ "name": "date_of_birth", "label": "Date of Birth", "type": "date" },
{ "name": "height", "label": "Height", "type": "text" },
{ "name": "religion", "label": "Religion", "type": "text" }
]
}

---

### form.html

- Input fields
- "name" must match config

---

### template.html

- Biodata layout
- Use placeholders like:
  {{full_name}}  
  {{date_of_birth}}

---

### style.css

- Template-specific styling
- Must remain isolated

---

## 7. ⚙️ Core Modules

### templateLoader.js

- Load template dynamically
- Inject form + preview

---

### formBinder.js

- Capture form input
- Update state

---

### previewEngine.js

- Replace placeholders
- Render live preview

---

### pdfGenerator.js

- Use html2pdf
- Export preview section

---

### stateManager.js

- Store current form data
- Single source of truth

---

## 8. 🎨 UI/UX Design System

### Theme Philosophy:

- Clean + Trustworthy + Elegant
- Focus on readability and simplicity

---

### Color Palette:

- Primary: #2563EB
- Secondary: #F8FAFC
- Accent: #10B981
- Text: #1F2937
- Border: #E5E7EB

---

### Typography:

- Font: Inter / Roboto / sans-serif
- Headings: Bold
- Body: Medium

---

### UI Behavior:

- Soft shadows
- Rounded corners (8–12px)
- Smooth transitions (0.2s ease)

---

### UX Principles:

- Instant feedback
- Minimal clicks
- No confusion

---

## 9. 📱 Responsiveness Rules

- Use Flexbox + Grid

Breakpoints:

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

---

## 10. 📄 PDF Generation Rules

- Export ONLY preview section
- Ensure:
  - Proper margins
  - No overflow
  - Print-friendly layout

---

## 11. 🚀 Deployment

- Netlify
- GitHub Pages

---

## 12. 🔁 Failure Recovery Strategy

If implementation breaks:

1. Restart from template loading
2. Validate flow:
   Form → State → Preview → PDF
3. Rebuild module-by-module

---

## 13. 🔮 Future Enhancements

- Save form data (localStorage)
- Drag & drop template builder
- Multi-language support
- Image upload (base64)

---

## 14. ✅ Final Validation Checklist

- Templates load dynamically
- Form updates preview instantly
- Fully responsive
- PDF downloads correctly
- New templates can be added without modifying core code

---

## FINAL INSTRUCTION TO AI

If anything is unclear:

- DO NOT GUESS
- Re-read this document
- Follow the defined flow strictly

Goal:
Reliable, scalable, minimal, production-grade static application
