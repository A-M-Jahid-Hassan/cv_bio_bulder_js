# 🧠 CLAUDE.md — Biodata Builder Web App

This file defines strict behavioral, architectural, and execution rules for Claude (or any AI agent) working on this project.

---

## 1. 🎯 Project Mission

Build a static, production-grade, mobile-responsive biodata builder web app where users can:

1. Select a template  
2. Fill out a form  
3. See a real-time preview  
4. Generate and download a PDF  

---

## 2. 🚫 Non-Negotiable Constraints

- No backend  
- No database  
- No authentication  
- No server-side rendering  
- Fully static (Netlify / GitHub Pages ready)  
- Should work offline after initial load (avoid runtime CDN dependencies if possible)  

---

## 3. 🧭 Core User Flow (DO NOT BREAK)

Template List → Select Template → Fill Form → Live Preview → PDF Preview → Download / Edit

If this flow breaks, the implementation is invalid.

---

## 4. 🧱 Architecture Rules

### 4.1 Application Type
- SPA (Single Page Application)
- Use Vanilla JavaScript (no frameworks unless absolutely necessary)

---

### 4.2 Module Separation (MANDATORY)

Each module must have a single responsibility:

- templateLoader.js → Load template files dynamically  
- formBinder.js → Handle form input and trigger updates  
- stateManager.js → Maintain global state  
- previewEngine.js → Render template with data  
- pdfGenerator.js → Generate downloadable PDF  
- router.js → Handle navigation  

Do not mix responsibilities across modules.

---

### 4.3 State Management Rules

Use a single global state object:

state = {
  templateId: null,
  formData: {}
}

Rules:
- All updates must go through controlled functions  
- No direct DOM-based state storage  
- State is the single source of truth  

---

## 5. 📁 Template System (CRITICAL)

### 5.1 Template Structure

Each template must be self-contained:

template_name/
- config.json
- form.html
- template.html
- style.css

---

### 5.2 config.json Rules

- Defines all fields  
- Acts as the single source of truth  

Example structure:

{
  "id": "marriage_bio_1",
  "name": "Marriage Biodata Classic",
  "fields": [
    { "name": "full_name", "type": "text" },
    { "name": "date_of_birth", "type": "date" }
  ]
}

---

### 5.3 Template Binding Rules

- Use placeholder format: {{field_name}}  
- previewEngine must:
  - Replace all placeholders  
  - Return empty string if data missing  

---

### 5.4 Adding New Templates

Adding a new template must NOT require changes in core JS files.

If core modification is needed → architecture is incorrect.

---

## 6. 🔄 Data Flow (STRICT)

User Input → formBinder → stateManager → previewEngine → DOM update

Rules:
- One-directional data flow  
- No circular updates  
- No reading data back from DOM  

---

## 7. 🖥️ UI Layout Rules

### Desktop
- Split screen:
  - Left → Form  
  - Right → Preview  

### Mobile
- Vertical stack:
  - Top → Form  
  - Bottom → Preview  

---

## 8. ⚡ Performance Rules

- Avoid unnecessary re-renders  
- Use debouncing for input if needed  
- Lazy load templates  
- Keep DOM updates minimal  

---

## 9. 📄 PDF Generation Rules

- Only export preview container  
- Ensure:
  - Proper margins  
  - No overflow  
  - Clean print layout  

Recommended library: html2pdf.js

---

## 10. 🎨 UI/UX Standards

### Design Philosophy
- Clean  
- Minimal  
- Professional  
- Trustworthy  

---

### Visual Rules
- Consistent spacing (8px system)  
- Rounded corners (8–12px)  
- Subtle shadows  
- No flashy or distracting colors  

---

### Color System
- Primary: #2563EB  
- Accent: #10B981  
- Background: #F8FAFC  
- Text: #1F2937  

---

## 11. 📱 Responsiveness

Breakpoints:
- Mobile: < 768px  
- Tablet: 768px – 1024px  
- Desktop: > 1024px  

Must work seamlessly across all device sizes.

---

## 12. ❌ Anti-Patterns (STRICTLY FORBIDDEN)

- Mixing business logic with DOM rendering  
- Hardcoding template data  
- Reading state from DOM  
- Tight coupling between modules  
- Manual template registration inside JS  

---

## 13. 🔁 Failure Recovery Protocol

If something breaks:

1. Stop adding new features  
2. Validate:
   - Template loading  
   - State updates  
   - Preview rendering  
3. Restart from the last working module  

---

## 14. 🧪 Validation Checklist

Before marking complete:

- Templates load dynamically  
- Form updates preview in real-time  
- Fully responsive layout works  
- PDF generates correctly  
- New templates can be added without modifying core logic  

---

## 15. 🧠 Final Instruction to AI

If anything is unclear:

- Do NOT guess  
- Re-read this document  
- Follow the defined architecture and flow  

Primary Goal:
Build a reliable, scalable, minimal, production-grade static application with clean separation of concerns.