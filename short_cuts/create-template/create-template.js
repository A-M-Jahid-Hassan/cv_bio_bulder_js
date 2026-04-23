#!/usr/bin/env node
/**
 * create-template.js  —  Biodata Builder: template scaffolder
 * Cross-platform: Linux · macOS · Windows  (Node.js 14+, no npm packages)
 *
 * Usage:
 *   Linux / macOS : node short_cuts/create-template.js
 *   Windows       : node short_cuts\create-template.js
 */

'use strict';

const readline = require('readline');
const fs       = require('fs');
const path     = require('path');

// ── Resolve paths ────────────────────────────────────────────────
const PROJECT_ROOT  = path.resolve(__dirname, '../..');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, 'templates');
const REGISTRY_FILE = path.join(TEMPLATES_DIR, 'registry.json');

// ── Prompts ──────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(prompt, defaultVal) {
  return new Promise(resolve => {
    const suffix = defaultVal != null ? ` [${defaultVal}]` : '';
    rl.question(`  ${prompt}${suffix}: `, answer => {
      const val = answer.trim();
      if (val)             return resolve(val);
      if (defaultVal != null) return resolve(String(defaultVal));
      process.stdout.write('     ⚠  Required — please enter a value.\n');
      ask(prompt, defaultVal).then(resolve);
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// String.replaceAll polyfill for Node 14
function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}

function ok(msg)  { console.log(`  ✓  ${msg}`); }
function fail(msg){ console.error(`\n  ✗  ${msg}\n`); rl.close(); process.exit(1); }

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ── Boilerplate ──────────────────────────────────────────────────
// DISPLAY_NAME and ROOT_CLASS are replaced via replaceAll() below.
// {{field_name}} is a Biodata Builder placeholder — NOT a JS template literal.

const FORM_BOILERPLATE = `\
<div class="form-wrapper">
  <h2 class="form-main-title">DISPLAY_NAME</h2>

  <!-- ═══ Section 1 — rename / duplicate as needed ═══ -->
  <div class="form-section">
    <h3 class="form-section-title">Personal Information</h3>

    <div class="form-group">
      <label for="full_name">Full Name</label>
      <input type="text" id="full_name" name="full_name" placeholder="Enter full name">
    </div>

    <div class="form-group">
      <label for="date_of_birth">Date of Birth</label>
      <input type="date" id="date_of_birth" name="date_of_birth">
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone" placeholder="+1 (555) 000-0000">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="example@email.com">
      </div>
    </div>

    <div class="form-group">
      <label for="address">Address</label>
      <textarea id="address" name="address" rows="3" placeholder="Enter address"></textarea>
    </div>
  </div>

  <!-- ═══ Add more sections below ═══
  <div class="form-section">
    <h3 class="form-section-title">Section Two</h3>
    ...
  </div>
  ═══ -->
</div>
`;

const TEMPLATE_BOILERPLATE = `\
<!-- ================================================================
     ROOT_CLASS  —  output document template
     Rules:
       • Use {{field_name}} wherever you want user input to appear
       • field_name must match a "name" in config.json (and form.html)
       • Scope all CSS under .ROOT_CLASS in style.css
     ================================================================ -->

<div class="ROOT_CLASS">

  <div class="ROOT_CLASS-header">
    <h1 class="ROOT_CLASS-name">{{full_name}}</h1>
    <p  class="ROOT_CLASS-sub">{{date_of_birth}}</p>
  </div>

  <div class="ROOT_CLASS-section">
    <div class="ROOT_CLASS-section-title">Contact Information</div>
    <table class="ROOT_CLASS-table">
      <tr>
        <td class="field-label">Phone</td>
        <td class="field-sep">:</td>
        <td class="field-value">{{phone}}</td>
      </tr>
      <tr>
        <td class="field-label">Email</td>
        <td class="field-sep">:</td>
        <td class="field-value">{{email}}</td>
      </tr>
      <tr>
        <td class="field-label">Address</td>
        <td class="field-sep">:</td>
        <td class="field-value">{{address}}</td>
      </tr>
    </table>
  </div>

  <!-- ═══ Add more sections below ═══
  <div class="ROOT_CLASS-section">
    <div class="ROOT_CLASS-section-title">Another Section</div>
    ...
  </div>
  ═══ -->

</div>
`;

const STYLE_BOILERPLATE = `\
/* ================================================================
   DISPLAY_NAME — Template Styles
   Every rule is scoped under .ROOT_CLASS so nothing leaks into
   the app UI.

   PDF tips:
     • Use px, not rem, for predictable PDF sizing
     • Keep max-width around 680–760px for clean A4 output
     • Avoid position:fixed / vh / vw units
   ================================================================ */

.ROOT_CLASS {
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 13px;
  color: #1a1a1a;
  background: #fff;
  padding: 32px;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Header ── */
.ROOT_CLASS-header {
  text-align: center;
  border-bottom: 2px solid #1a237e;
  padding-bottom: 14px;
  margin-bottom: 18px;
}

.ROOT_CLASS-name {
  font-size: 24px;
  font-weight: 700;
  color: #1a237e;
  margin: 0 0 4px;
  letter-spacing: 1px;
}

.ROOT_CLASS-sub {
  font-size: 13px;
  color: #555;
  margin: 0;
}

/* ── Sections ── */
.ROOT_CLASS-section {
  margin-bottom: 14px;
}

.ROOT_CLASS-section-title {
  background: #1a237e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 10px;
  margin-bottom: 6px;
}

/* ── Table ── */
.ROOT_CLASS-table {
  width: 100%;
  border-collapse: collapse;
}

.ROOT_CLASS-table tr:nth-child(even) td {
  background: #f5f5ff;
}

.ROOT_CLASS-table .field-label {
  width: 28%;
  font-weight: 600;
  color: #1a237e;
  font-size: 12px;
  padding: 4px 6px;
  white-space: nowrap;
}

.ROOT_CLASS-table .field-sep {
  width: 4%;
  text-align: center;
  color: #888;
  padding: 4px 2px;
}

.ROOT_CLASS-table .field-value {
  font-size: 12.5px;
  padding: 4px 6px;
}
`;

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log();
  console.log('  ' + '═'.repeat(44));
  console.log('   Biodata Builder — Template Scaffolder');
  console.log('  ' + '═'.repeat(44));
  console.log();

  // 1. Collect inputs
  const displayName = await ask('Template display name  (e.g. "Marriage Biodata Modern")');
  const suggestedId = slugify(displayName);
  const templateId  = await ask('Template ID  (folder name, lowercase_underscores)', suggestedId);

  if (!/^[a-z0-9_]+$/.test(templateId))
    fail('ID must contain only lowercase letters, numbers, and underscores.');

  const templateDir = path.join(TEMPLATES_DIR, templateId);
  if (fs.existsSync(templateDir))
    fail(`Template '${templateId}' already exists at templates/${templateId}`);

  const description  = await ask('Short description', `${displayName} template`);
  console.log();
  console.log('  Category choices:  marriage  |  cv  |  other');
  const category     = await ask('Category', 'marriage');
  const pdfFilename  = await ask('PDF output filename', `${templateId}.pdf`);

  rl.close();

  // 2. Create files
  console.log();
  console.log('  Creating files...');
  console.log();

  fs.mkdirSync(templateDir);
  ok(`templates/${templateId}/`);

  const rootClass = templateId.replace(/_/g, '-');

  // config.json
  writeJson(path.join(templateDir, 'config.json'), {
    id:          templateId,
    name:        displayName,
    pdfFilename: pdfFilename,
    fields: [
      { name: 'full_name',     label: 'Full Name',    type: 'text'     },
      { name: 'date_of_birth', label: 'Date of Birth',type: 'date'     },
      { name: 'phone',         label: 'Phone',        type: 'tel'      },
      { name: 'email',         label: 'Email',        type: 'email'    },
      { name: 'address',       label: 'Address',      type: 'textarea' },
    ]
  });
  ok(`templates/${templateId}/config.json`);

  // form.html
  writeText(
    path.join(templateDir, 'form.html'),
    replaceAll(FORM_BOILERPLATE, 'DISPLAY_NAME', displayName)
  );
  ok(`templates/${templateId}/form.html`);

  // template.html
  writeText(
    path.join(templateDir, 'template.html'),
    replaceAll(TEMPLATE_BOILERPLATE, 'ROOT_CLASS', rootClass)
  );
  ok(`templates/${templateId}/template.html`);

  // style.css
  writeText(
    path.join(templateDir, 'style.css'),
    replaceAll(
      replaceAll(STYLE_BOILERPLATE, 'DISPLAY_NAME', displayName),
      'ROOT_CLASS', rootClass
    )
  );
  ok(`templates/${templateId}/style.css`);

  // Update registry.json
  const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  registry.push({ id: templateId, name: displayName, description, category });
  writeJson(REGISTRY_FILE, registry);
  ok('templates/registry.json  (updated)');

  // 3. Summary
  console.log();
  console.log('  ' + '─'.repeat(44));
  console.log(`   Done!  "${displayName}"  is ready.`);
  console.log('  ' + '─'.repeat(44));
  console.log();
  console.log(`  templates/${templateId}/`);
  console.log(`    ├── config.json    ← add / remove fields here`);
  console.log(`    ├── form.html      ← name= must match config fields`);
  console.log(`    ├── template.html  ← use {{field_name}} placeholders`);
  console.log(`    └── style.css      ← scoped under .${rootClass}`);
  console.log();
  console.log('  See documentation/adding-templates.md for the full guide.');
  console.log('  Reload  templates.html  in the browser to see it.');
  console.log();
}

main().catch(e => { console.error(e.message); rl.close(); process.exit(1); });
