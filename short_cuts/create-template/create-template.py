#!/usr/bin/env python3
"""
create-template.py  —  Biodata Builder: template scaffolder
Cross-platform: Linux · macOS · Windows  (Python 3.6+, no extra packages)

Usage:
  Linux / macOS : python3 short_cuts/create-template.py
  Windows       : python  short_cuts\\create-template.py
"""

import os, json, re, sys

# ── Resolve paths relative to this script ───────────────────────
SCRIPT_DIR    = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT  = os.path.dirname(os.path.dirname(SCRIPT_DIR))
TEMPLATES_DIR = os.path.join(PROJECT_ROOT, 'templates')
REGISTRY_FILE = os.path.join(TEMPLATES_DIR, 'registry.json')

# ── I/O helpers ──────────────────────────────────────────────────
def ask(prompt, default=None):
    suffix = f' [{default}]' if default is not None else ''
    while True:
        val = input(f'  {prompt}{suffix}: ').strip()
        if val:
            return val
        if default is not None:
            return default
        print('     ⚠  Required — please enter a value.')

def ok(msg):   print(f'  ✓  {msg}')
def fail(msg): print(f'\n  ✗  {msg}\n'); sys.exit(1)

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s_]', '', text)
    text = re.sub(r'\s+', '_', text)
    return text.strip('_')

def write_text(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

# ── Boilerplate templates ─────────────────────────────────────────
# DISPLAY_NAME and ROOT_CLASS are replaced with .replace() below.
# {{field_name}} stays as-is — it is NOT a Python format string.

FORM_BOILERPLATE = """\
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
"""

TEMPLATE_BOILERPLATE = """\
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
"""

STYLE_BOILERPLATE = """\
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
"""

# ── Main ─────────────────────────────────────────────────────────
def main():
    print()
    print('  ' + '═' * 44)
    print('   Biodata Builder — Template Scaffolder')
    print('  ' + '═' * 44)
    print()

    # 1. Collect inputs
    display_name = ask('Template display name  (e.g. "Marriage Biodata Modern")')

    suggested_id = slugify(display_name)
    template_id  = ask('Template ID  (folder name, lowercase_underscores)', default=suggested_id)

    if not re.match(r'^[a-z0-9_]+$', template_id):
        fail('ID must contain only lowercase letters, numbers, and underscores.')

    template_dir = os.path.join(TEMPLATES_DIR, template_id)
    if os.path.exists(template_dir):
        fail(f"Template '{template_id}' already exists at templates/{template_id}")

    description  = ask('Short description', default=f'{display_name} template')

    print()
    print('  Category choices:  marriage  |  cv  |  other')
    category     = ask('Category', default='marriage')
    pdf_filename = ask('PDF output filename', default=f'{template_id}.pdf')

    # 2. Create files
    print()
    print('  Creating files...')
    print()

    os.makedirs(template_dir)
    ok(f'templates/{template_id}/')

    root_class = template_id.replace('_', '-')

    # config.json
    config = {
        'id':          template_id,
        'name':        display_name,
        'pdfFilename': pdf_filename,
        'fields': [
            {'name': 'full_name',    'label': 'Full Name',    'type': 'text'},
            {'name': 'date_of_birth','label': 'Date of Birth','type': 'date'},
            {'name': 'phone',        'label': 'Phone',        'type': 'tel'},
            {'name': 'email',        'label': 'Email',        'type': 'email'},
            {'name': 'address',      'label': 'Address',      'type': 'textarea'},
        ]
    }
    write_json(os.path.join(template_dir, 'config.json'), config)
    ok(f'templates/{template_id}/config.json')

    # form.html
    write_text(
        os.path.join(template_dir, 'form.html'),
        FORM_BOILERPLATE.replace('DISPLAY_NAME', display_name)
    )
    ok(f'templates/{template_id}/form.html')

    # template.html
    write_text(
        os.path.join(template_dir, 'template.html'),
        TEMPLATE_BOILERPLATE.replace('ROOT_CLASS', root_class)
    )
    ok(f'templates/{template_id}/template.html')

    # style.css
    write_text(
        os.path.join(template_dir, 'style.css'),
        STYLE_BOILERPLATE
            .replace('DISPLAY_NAME', display_name)
            .replace('ROOT_CLASS',   root_class)
    )
    ok(f'templates/{template_id}/style.css')

    # Update registry.json
    with open(REGISTRY_FILE, 'r', encoding='utf-8') as f:
        registry = json.load(f)
    registry.append({
        'id':          template_id,
        'name':        display_name,
        'description': description,
        'category':    category,
    })
    write_json(REGISTRY_FILE, registry)
    ok('templates/registry.json  (updated)')

    # 3. Summary
    print()
    print('  ' + '─' * 44)
    print(f'   Done!  "{display_name}"  is ready.')
    print('  ' + '─' * 44)
    print()
    print(f'  templates/{template_id}/')
    print(f'    ├── config.json    ← add / remove fields here')
    print(f'    ├── form.html      ← name= must match config fields')
    print(f'    ├── template.html  ← use {{{{field_name}}}} placeholders')
    print(f'    └── style.css      ← scoped under .{root_class}')
    print()
    print('  See documentation/adding-templates.md for the full guide.')
    print('  Reload  templates.html  in the browser to see it.')
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n  Cancelled.\n')
        sys.exit(0)
