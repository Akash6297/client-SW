/**
 * SmoothWeb Admin Backend
 * Google Apps Script + Google Sheets API for the /admin panel.
 *
 * SETUP: see README.md in this folder for full step-by-step instructions.
 * One-time setup:
 *   1. Edit NEW_ADMIN_PASSWORD and SITE_API_KEY below.
 *   2. Run `runSetup` once from the Apps Script editor (select it from the
 *      function dropdown and click Run). This creates all sheet tabs,
 *      seeds default settings, and stores your hashed admin password.
 *   3. Deploy > New deployment > Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the deployment URL into src/admin/config.js (ADMIN_SCRIPT_URL).
 */

// ===================== CONFIG =====================

// Used only by runSetup() — change this, run setup once, then you can leave it.
const NEW_ADMIN_PASSWORD = 'changeme123';

// Shared secret used by public-facing "record sale" calls (Booking/CardCreator
// payment success) so random visitors can't write fake income entries.
// Change this to your own random string and update src/admin/config.js to match.
const SITE_API_KEY = 'smoothweb-site-key-change-me';

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const SHEET_CONFIG = {
  Settings: ['Key', 'Value'],
  SEO: ['PageKey', 'Title', 'Description', 'Keywords', 'OGImage', 'Canonical', 'UpdatedAt'],
  Finance: ['ID', 'Date', 'Type', 'Category', 'Description', 'Client', 'Amount', 'CreatedAt'],
  Clients: ['ID', 'Name', 'Email', 'Phone', 'Status', 'Source', 'Notes', 'CreatedAt', 'UpdatedAt'],
  Projects: ['ID', 'Title', 'Client', 'Stage', 'Value', 'DueDate', 'Notes', 'CreatedAt', 'UpdatedAt'],
  Sessions: ['Token', 'ExpiresAt', 'CreatedAt'],
  Pageviews: ['Date', 'Path', 'Count'],
};

const PUBLIC_SETTING_KEYS = ['GA_MEASUREMENT_ID', 'ROBOTS_TXT', 'SITE_NAME'];

const PUBLIC_ACTIONS = ['login', 'getSeo', 'getPublicSettings', 'logPageview', 'recordSale'];

// ===================== ENTRY POINTS =====================

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    return route(body.action, body.token, body.payload || {});
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const payload = Object.assign({}, e.parameter);
    return route(action, e.parameter.token, payload);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function route(action, token, payload) {
  if (!PUBLIC_ACTIONS.includes(action)) {
    const session = validateToken(token);
    if (!session) return jsonResponse({ success: false, error: 'Unauthorized' });
  }

  switch (action) {
    case 'login': return handleLogin(payload);
    case 'logout': return handleLogout(token);
    case 'validateSession': return jsonResponse({ success: true });
    case 'changePassword': return handleChangePassword(token, payload);

    case 'getSeo': return handleGetSeo(payload);
    case 'saveSeo': return handleSaveSeo(payload);

    case 'getSettings': return handleGetSettings();
    case 'getPublicSettings': return handleGetPublicSettings();
    case 'saveSettings': return handleSaveSettings(payload);

    case 'getFinance': return handleGetFinance();
    case 'addFinance': return handleAddFinance(payload);
    case 'updateFinance': return handleUpdateFinance(payload);
    case 'deleteFinance': return handleDeleteFinance(payload);
    case 'recordSale': return handleRecordSale(payload);

    case 'getClients': return handleGetClients();
    case 'addClient': return handleAddClient(payload);
    case 'updateClient': return handleUpdateClient(payload);
    case 'deleteClient': return handleDeleteClient(payload);

    case 'getProjects': return handleGetProjects();
    case 'addProject': return handleAddProject(payload);
    case 'updateProject': return handleUpdateProject(payload);
    case 'deleteProject': return handleDeleteProject(payload);

    case 'logPageview': return handleLogPageview(payload);
    case 'getPageviews': return handleGetPageviews();

    default: return jsonResponse({ success: false, error: 'Unknown action' });
  }
}

// ===================== AUTH =====================

function handleLogin(payload) {
  const props = PropertiesService.getScriptProperties();
  const lockoutUntil = Number(props.getProperty('LOCKOUT_UNTIL') || 0);
  const now = Date.now();

  if (lockoutUntil > now) {
    const minutes = Math.ceil((lockoutUntil - now) / 60000);
    return jsonResponse({ success: false, error: `Too many attempts. Try again in ${minutes} minute(s).` });
  }

  const storedHash = props.getProperty('ADMIN_PASSWORD_HASH');
  const inputHash = sha256(String(payload.password || ''));

  if (!storedHash || inputHash !== storedHash) {
    const attempts = Number(props.getProperty('FAILED_ATTEMPTS') || 0) + 1;
    props.setProperty('FAILED_ATTEMPTS', String(attempts));
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      props.setProperty('LOCKOUT_UNTIL', String(now + LOCKOUT_DURATION_MS));
      props.setProperty('FAILED_ATTEMPTS', '0');
      return jsonResponse({ success: false, error: 'Too many attempts. Account locked for 15 minutes.' });
    }
    return jsonResponse({ success: false, error: 'Incorrect password.' });
  }

  props.setProperty('FAILED_ATTEMPTS', '0');
  props.deleteProperty('LOCKOUT_UNTIL');

  const token = Utilities.getUuid();
  const expiresAt = now + SESSION_DURATION_MS;
  const sheet = getSheet('Sessions');
  sheet.appendRow([token, expiresAt, now]);
  pruneExpiredSessions(sheet);

  return jsonResponse({ success: true, token, expiresAt });
}

function handleLogout(token) {
  const sheet = getSheet('Sessions');
  deleteRowsWhere(sheet, (row) => row.Token === token);
  return jsonResponse({ success: true });
}

function handleChangePassword(token, payload) {
  const props = PropertiesService.getScriptProperties();
  const storedHash = props.getProperty('ADMIN_PASSWORD_HASH');
  const oldHash = sha256(String(payload.oldPassword || ''));

  if (oldHash !== storedHash) {
    return jsonResponse({ success: false, error: 'Current password is incorrect.' });
  }
  if (!payload.newPassword || String(payload.newPassword).length < 8) {
    return jsonResponse({ success: false, error: 'New password must be at least 8 characters.' });
  }

  props.setProperty('ADMIN_PASSWORD_HASH', sha256(String(payload.newPassword)));
  return jsonResponse({ success: true });
}

function validateToken(token) {
  if (!token) return null;
  const sheet = getSheet('Sessions');
  const rows = sheetToObjects(sheet);
  const now = Date.now();
  const session = rows.find((r) => r.Token === token && Number(r.ExpiresAt) > now);
  return session || null;
}

function pruneExpiredSessions(sheet) {
  const now = Date.now();
  deleteRowsWhere(sheet, (row) => Number(row.ExpiresAt) <= now);
}

// ===================== SEO =====================

function handleGetSeo(payload) {
  const sheet = getSheet('SEO');
  const rows = sheetToObjects(sheet);
  if (payload.page) {
    const row = rows.find((r) => r.PageKey === payload.page);
    return jsonResponse({ success: true, data: row || null });
  }
  return jsonResponse({ success: true, data: rows });
}

function handleSaveSeo(payload) {
  const sheet = getSheet('SEO');
  const pageKey = payload.page;
  if (!pageKey) return jsonResponse({ success: false, error: 'Missing page key' });

  const updates = {
    PageKey: pageKey,
    Title: payload.title || '',
    Description: payload.description || '',
    Keywords: payload.keywords || '',
    OGImage: payload.ogImage || '',
    Canonical: payload.canonical || '',
    UpdatedAt: new Date().toISOString(),
  };

  const rows = sheetToObjects(sheet);
  const existingIndex = rows.findIndex((r) => r.PageKey === pageKey);

  if (existingIndex === -1) {
    appendRow(sheet, updates);
  } else {
    updateRowByIndex(sheet, existingIndex, updates);
  }
  return jsonResponse({ success: true });
}

// ===================== SETTINGS =====================

function handleGetSettings() {
  const sheet = getSheet('Settings');
  const rows = sheetToObjects(sheet);
  const settings = {};
  rows.forEach((r) => { settings[r.Key] = r.Value; });
  return jsonResponse({ success: true, data: settings });
}

function handleGetPublicSettings() {
  const sheet = getSheet('Settings');
  const rows = sheetToObjects(sheet);
  const settings = {};
  rows.forEach((r) => {
    if (PUBLIC_SETTING_KEYS.includes(r.Key)) settings[r.Key] = r.Value;
  });
  return jsonResponse({ success: true, data: settings });
}

function handleSaveSettings(payload) {
  const sheet = getSheet('Settings');
  const data = payload.settings || {};
  Object.keys(data).forEach((key) => setSetting(sheet, key, String(data[key])));
  return jsonResponse({ success: true });
}

function setSetting(sheet, key, value) {
  const rows = sheetToObjects(sheet);
  const index = rows.findIndex((r) => r.Key === key);
  if (index === -1) {
    appendRow(sheet, { Key: key, Value: value });
  } else {
    updateRowByIndex(sheet, index, { Key: key, Value: value });
  }
}

// ===================== FINANCE =====================

function handleGetFinance() {
  const sheet = getSheet('Finance');
  return jsonResponse({ success: true, data: sheetToObjects(sheet) });
}

function handleAddFinance(payload) {
  const sheet = getSheet('Finance');
  const entry = {
    ID: Utilities.getUuid(),
    Date: payload.date || new Date().toISOString().slice(0, 10),
    Type: payload.type === 'expense' ? 'expense' : 'income',
    Category: payload.category || 'Other',
    Description: payload.description || '',
    Client: payload.client || '',
    Amount: Number(payload.amount) || 0,
    CreatedAt: new Date().toISOString(),
  };
  appendRow(sheet, entry);
  return jsonResponse({ success: true, data: entry });
}

function handleUpdateFinance(payload) {
  const sheet = getSheet('Finance');
  const rows = sheetToObjects(sheet);
  const index = rows.findIndex((r) => r.ID === payload.id);
  if (index === -1) return jsonResponse({ success: false, error: 'Entry not found' });

  updateRowByIndex(sheet, index, {
    Date: payload.date,
    Type: payload.type === 'expense' ? 'expense' : 'income',
    Category: payload.category,
    Description: payload.description,
    Client: payload.client,
    Amount: Number(payload.amount) || 0,
  });
  return jsonResponse({ success: true });
}

function handleDeleteFinance(payload) {
  const sheet = getSheet('Finance');
  deleteRowsWhere(sheet, (row) => row.ID === payload.id);
  return jsonResponse({ success: true });
}

// Public action: triggered after a successful Razorpay payment on the public
// site to auto-log income. Requires SITE_API_KEY to deter spam writes.
function handleRecordSale(payload) {
  if (payload.apiKey !== SITE_API_KEY) {
    return jsonResponse({ success: false, error: 'Unauthorized' });
  }
  const sheet = getSheet('Finance');
  const entry = {
    ID: Utilities.getUuid(),
    Date: new Date().toISOString().slice(0, 10),
    Type: 'income',
    Category: payload.category || 'Sale',
    Description: payload.description || '',
    Client: payload.client || '',
    Amount: Number(payload.amount) || 0,
    CreatedAt: new Date().toISOString(),
  };
  appendRow(sheet, entry);
  return jsonResponse({ success: true });
}

// ===================== CLIENTS =====================

function handleGetClients() {
  const sheet = getSheet('Clients');
  return jsonResponse({ success: true, data: sheetToObjects(sheet) });
}

function handleAddClient(payload) {
  const sheet = getSheet('Clients');
  const now = new Date().toISOString();
  const entry = {
    ID: Utilities.getUuid(),
    Name: payload.name || '',
    Email: payload.email || '',
    Phone: payload.phone || '',
    Status: payload.status || 'New',
    Source: payload.source || '',
    Notes: payload.notes || '',
    CreatedAt: now,
    UpdatedAt: now,
  };
  appendRow(sheet, entry);
  return jsonResponse({ success: true, data: entry });
}

function handleUpdateClient(payload) {
  const sheet = getSheet('Clients');
  const rows = sheetToObjects(sheet);
  const index = rows.findIndex((r) => r.ID === payload.id);
  if (index === -1) return jsonResponse({ success: false, error: 'Client not found' });

  updateRowByIndex(sheet, index, {
    Name: payload.name,
    Email: payload.email,
    Phone: payload.phone,
    Status: payload.status,
    Source: payload.source,
    Notes: payload.notes,
    UpdatedAt: new Date().toISOString(),
  });
  return jsonResponse({ success: true });
}

function handleDeleteClient(payload) {
  const sheet = getSheet('Clients');
  deleteRowsWhere(sheet, (row) => row.ID === payload.id);
  return jsonResponse({ success: true });
}

// ===================== PROJECTS =====================

function handleGetProjects() {
  const sheet = getSheet('Projects');
  return jsonResponse({ success: true, data: sheetToObjects(sheet) });
}

function handleAddProject(payload) {
  const sheet = getSheet('Projects');
  const now = new Date().toISOString();
  const entry = {
    ID: Utilities.getUuid(),
    Title: payload.title || '',
    Client: payload.client || '',
    Stage: payload.stage || 'Inquiry',
    Value: Number(payload.value) || 0,
    DueDate: payload.dueDate || '',
    Notes: payload.notes || '',
    CreatedAt: now,
    UpdatedAt: now,
  };
  appendRow(sheet, entry);
  return jsonResponse({ success: true, data: entry });
}

function handleUpdateProject(payload) {
  const sheet = getSheet('Projects');
  const rows = sheetToObjects(sheet);
  const index = rows.findIndex((r) => r.ID === payload.id);
  if (index === -1) return jsonResponse({ success: false, error: 'Project not found' });

  updateRowByIndex(sheet, index, {
    Title: payload.title,
    Client: payload.client,
    Stage: payload.stage,
    Value: Number(payload.value) || 0,
    DueDate: payload.dueDate,
    Notes: payload.notes,
    UpdatedAt: new Date().toISOString(),
  });
  return jsonResponse({ success: true });
}

function handleDeleteProject(payload) {
  const sheet = getSheet('Projects');
  deleteRowsWhere(sheet, (row) => row.ID === payload.id);
  return jsonResponse({ success: true });
}

// ===================== PAGEVIEWS =====================

function handleLogPageview(payload) {
  const sheet = getSheet('Pageviews');
  const path = (payload.path || '/').slice(0, 200);
  const date = new Date().toISOString().slice(0, 10);
  const rows = sheetToObjects(sheet);
  const index = rows.findIndex((r) => r.Date === date && r.Path === path);

  if (index === -1) {
    appendRow(sheet, { Date: date, Path: path, Count: 1 });
  } else {
    updateRowByIndex(sheet, index, { Count: Number(rows[index].Count) + 1 });
  }
  return jsonResponse({ success: true });
}

function handleGetPageviews() {
  const sheet = getSheet('Pageviews');
  const rows = sheetToObjects(sheet);

  const totalsByPath = {};
  const totalsByDate = {};
  let total = 0;

  rows.forEach((r) => {
    const count = Number(r.Count) || 0;
    total += count;
    totalsByPath[r.Path] = (totalsByPath[r.Path] || 0) + count;
    totalsByDate[r.Date] = (totalsByDate[r.Date] || 0) + count;
  });

  const topPages = Object.keys(totalsByPath)
    .map((path) => ({ path, count: totalsByPath[path] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const last14Days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last14Days.push({ date: key, count: totalsByDate[key] || 0 });
  }

  return jsonResponse({ success: true, data: { total, topPages, daily: last14Days } });
}

// ===================== SHEET HELPERS =====================

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(SHEET_CONFIG[name]);
  }
  return sheet;
}

function sheetToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== '' && cell !== null))
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function appendRow(sheet, obj) {
  const headers = SHEET_CONFIG[sheet.getName()];
  const row = headers.map((h) => (obj[h] !== undefined ? obj[h] : ''));
  sheet.appendRow(row);
}

// index is 0-based position within data rows (excluding header)
function updateRowByIndex(sheet, index, updates) {
  const headers = SHEET_CONFIG[sheet.getName()];
  const rowNumber = index + 2; // +1 for header, +1 for 1-based
  const currentValues = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];

  headers.forEach((h, i) => {
    if (updates[h] !== undefined) currentValues[i] = updates[h];
  });

  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([currentValues]);
}

function deleteRowsWhere(sheet, predicate) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  const headers = values[0];

  for (let i = values.length - 1; i >= 1; i--) {
    const obj = {};
    headers.forEach((h, j) => { obj[h] = values[i][j]; });
    if (predicate(obj)) {
      sheet.deleteRow(i + 1);
    }
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sha256(text) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return digest.map((byte) => {
    const hex = (byte & 0xFF).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// ===================== ONE-TIME SETUP =====================

function runSetup() {
  // Set admin password (hashed) FIRST, so it's saved even if sheet
  // creation below hits a permissions prompt/error.
  setAdminPassword();

  // Create all sheet tabs with headers
  Object.keys(SHEET_CONFIG).forEach((name) => getSheet(name));

  // Seed default settings
  const settingsSheet = getSheet('Settings');
  const existing = sheetToObjects(settingsSheet).map((r) => r.Key);
  const defaults = {
    SITE_NAME: 'SmoothWeb',
    GA_MEASUREMENT_ID: '',
    ROBOTS_TXT: 'User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://smoothweb.in/sitemap.xml',
  };
  Object.keys(defaults).forEach((key) => {
    if (!existing.includes(key)) appendRow(settingsSheet, { Key: key, Value: defaults[key] });
  });

  Logger.log('Setup complete. Admin password has been set. Deploy this script as a Web App.');
}

// Standalone: sets/resets the admin password hash from NEW_ADMIN_PASSWORD.
// Run this directly (and check the log) if login keeps failing even though
// you're typing the right password — it means this was never saved.
function setAdminPassword() {
  const hash = sha256(NEW_ADMIN_PASSWORD);
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD_HASH', hash);
  Logger.log('Admin password set from NEW_ADMIN_PASSWORD ("' + NEW_ADMIN_PASSWORD + '"). Hash: ' + hash);
}

// Run this once if you get locked out ("Too many attempts") during testing.
// Select resetLockout from the function dropdown and click Run.
function resetLockout() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('LOCKOUT_UNTIL');
  props.deleteProperty('FAILED_ATTEMPTS');
  Logger.log('Lockout cleared. ADMIN_PASSWORD_HASH is currently: ' + (props.getProperty('ADMIN_PASSWORD_HASH') || '(EMPTY - run setAdminPassword!)'));
}
