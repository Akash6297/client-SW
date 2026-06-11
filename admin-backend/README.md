# SmoothWeb Admin Backend Setup (Google Sheets + Apps Script)

This is the data store + API for the `/admin` panel. It costs nothing and
needs no server — it's a Google Sheet plus an Apps Script "Web App".

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **"SmoothWeb Admin DB"**.
3. You don't need to create any tabs manually — the script creates them automatically.

## 2. Add the Apps Script

1. In the Sheet, go to **Extensions > Apps Script**.
2. Delete the default contents of `Code.gs`.
3. Copy the entire contents of [`Code.gs`](./Code.gs) from this folder and paste it in.
4. At the top of the file, edit these two lines:
   ```js
   const NEW_ADMIN_PASSWORD = 'changeme123';        // <-- set your real admin password
   const SITE_API_KEY = 'smoothweb-site-key-change-me'; // <-- set a long random string
   ```
   Pick a strong password — this is the password you'll use to log into `/admin`.
   `SITE_API_KEY` is a separate secret used only to let the Booking/Card payment
   flows record a sale automatically; any random string works.

## 3. Run the one-time setup

1. In the Apps Script editor, use the function dropdown (top toolbar) and select **`runSetup`**.
2. Click **Run** (▶). The first time, Google will ask you to authorize the script — accept it (it only needs access to this one Sheet).
3. Check the **Execution log** — it should say "Setup complete...".
4. This creates all the sheet tabs (`Settings`, `SEO`, `Finance`, `Clients`, `Projects`, `Sessions`, `Pageviews`) and stores your hashed password.

> You can change the admin password later from the Settings page in `/admin` —
> you don't need to come back here unless something breaks.

## 4. Deploy as a Web App

1. Click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure:
   - **Execute as**: `Me (your account)`
   - **Who has access**: `Anyone`
4. Click **Deploy**, authorize again if prompted.
5. Copy the **Web app URL** (ends with `/exec`).

## 5. Connect the frontend

Open [`src/admin/config.js`](../src/admin/config.js) in this project and paste the URL:

```js
export const ADMIN_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
export const SITE_API_KEY = "smoothweb-site-key-change-me"; // must match Code.gs
```

Make sure `SITE_API_KEY` here matches the one you set in `Code.gs` exactly.

## 6. Log in

1. Run the site (`npm run dev` or your deployed URL) and go to `/admin`.
2. You'll be redirected to `/admin/login`. Enter the password you set in step 2.
3. You're in! From here you can manage SEO, finances, clients, projects, and settings — including changing your password — without touching this script again.

## Re-deploying after editing Code.gs

If you ever edit `Code.gs` again (e.g. to add a feature), you must create a
**new deployment version** for changes to take effect:
**Deploy > Manage deployments > (pencil/edit icon) > Version: New version > Deploy**.
The URL stays the same.

## Mail (Compose & Send / Templates)

The `/admin/mail` page lets you email clients directly from the admin panel
using customizable HTML templates.

- Templates are stored in the **MailTemplates** sheet (created automatically,
  with `ColorPrimary`/`ColorHeader`/`ColorText` columns added automatically if
  you're upgrading from an older version). `runSetup` seeds 3 starter
  templates the first time it runs.
- Sending uses `MailApp.sendEmail()`, which sends from **your own Google
  account** (the one that deployed this script) — no extra setup needed.
  Google's daily sending limit applies (~100/day for a personal Gmail
  account, ~1500/day for Google Workspace).
- The first time you send an email after adding this feature, Google may ask
  you to **re-authorize** the script (it now requests permission to send
  email on your behalf).
- Fill in **Settings > Business & Email Branding** (business name, logo URL,
  socials, contact info) — these values fill in the `{{merge_fields}}` used
  by templates so emails look professional and on-brand.

### Theme colors

Each template (and the Compose screen) has a **Theme Colors** picker for
Primary/Buttons, Header Background, and Body Text. These map to
`{{color_primary}}`, `{{color_header}}` and `{{color_text}}` merge fields
used throughout the default templates and snippets, so changing them
re-themes the whole email.

### Bulk send

On the Compose screen you can tick multiple clients (and/or paste extra,
comma/newline-separated email addresses) to send the same message to
everyone at once. Each recipient still gets `{{client_name}}` etc. resolved
with their own details. Sending to 2+ recipients uses the `sendBulkMail`
action (max 100 per batch).

## Booking & Contact form leads

The public **Booking** (`/book`) and **Contact** (`/contact`) pages send a
copy of each submission to this same Sheet via the public `submitLead`
action (secured with `SITE_API_KEY`, like `recordSale`). They show up in
**Clients & Leads** (`/admin/clients`) with `Source` set to `Booking - …` or
`Contact Form`, so you can see them and reply via **Email > Mail** right from
the admin panel.

## Notes on security

- The admin password is stored only as a SHA-256 hash, never in plain text.
- After 5 failed login attempts, login is locked for 15 minutes.
- Sessions expire after 12 hours.
- All write actions (and most read actions) require a valid session token,
  checked on the server (Apps Script) — not just hidden in the UI.
- This setup is appropriate for a single-admin small business tool. It is not
  intended for high-security/multi-tenant use.
