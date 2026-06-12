// PASTE YOUR DEPLOYED APPS SCRIPT WEB APP URL HERE (see admin-backend/README.md)
export const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwc9n12qbsAwUkVNXuXLX4iVU7kV7KG47gi7cbucqhrFyypkhIxChaVneQK6dWmbOYK/exec";

// Must match SITE_API_KEY in admin-backend/Code.gs exactly.
export const SITE_API_KEY = "smoothweb-site-key-change-me";

export const PIPELINE_STAGES = [
  'Inquiry',
  'Proposal Sent',
  'Booked',
  'In Progress',
  'Delivered',
  'Paid',
];

export const INCOME_CATEGORIES = [
  'Strategy Session',
  'Custom Card',
  'Portfolio Project',
  'Ad Funnel Setup',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Hosting & Domains',
  'Software & Tools',
  'Marketing & Ads',
  'Contractor / Freelancer',
  'Other Expense',
];

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Negotiating',
  'Converted',
  'Lost',
];

// Merge fields available when composing/customizing mail templates.
// Resolved by src/admin/utils/mailMerge.js using the selected client +
// the Business & Branding settings (saved from /admin/settings).
export const MAIL_MERGE_FIELDS = [
  { key: '{{client_name}}', label: 'Client Name' },
  { key: '{{client_email}}', label: 'Client Email' },
  { key: '{{business_name}}', label: 'Business Name' },
  { key: '{{business_website}}', label: 'Website' },
  { key: '{{business_phone}}', label: 'Phone' },
  { key: '{{business_address}}', label: 'Address' },
  { key: '{{logo_url}}', label: 'Logo URL' },
  { key: '{{social_instagram}}', label: 'Instagram' },
  { key: '{{social_facebook}}', label: 'Facebook' },
  { key: '{{social_linkedin}}', label: 'LinkedIn' },
  { key: '{{social_twitter}}', label: 'Twitter / X' },
  { key: '{{social_youtube}}', label: 'YouTube' },
  { key: '{{current_year}}', label: 'Current Year' },
  { key: '{{color_primary}}', label: 'Theme: Primary Color' },
  { key: '{{color_header}}', label: 'Theme: Header Color' },
  { key: '{{color_text}}', label: 'Theme: Text Color' },
];

// Reusable HTML blocks insertable into a mail template body via the editor
// toolbar — lets the user build attractive, on-brand emails without writing
// HTML from scratch. Use the merge fields above inside the snippet HTML.
export const MAIL_SNIPPETS = [
  {
    label: 'Logo Header',
    html: `<div style="text-align:center;padding:16px 0;">
  <img src="{{logo_url}}" alt="{{business_name}}" style="max-height:50px;" />
  <h2 style="margin:8px 0 0;font-family:Arial,sans-serif;color:{{color_header}};">{{business_name}}</h2>
</div>`,
  },
  {
    label: 'Image Block',
    html: `<div style="text-align:center;margin:20px 0;">
  <img src="https://your-image-url.com/image.jpg" alt="" style="max-width:100%;border-radius:12px;" />
</div>`,
  },
  {
    label: 'Button / CTA',
    html: `<p style="text-align:center;margin:28px 0;">
  <a href="{{business_website}}" style="background:{{color_primary}};color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:14px 32px;border-radius:999px;display:inline-block;">Click Here</a>
</p>`,
  },
  {
    label: 'Social Links',
    html: `<p style="text-align:center;margin:20px 0;">
  <a href="{{social_instagram}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Instagram</a>
  <a href="{{social_facebook}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Facebook</a>
  <a href="{{social_linkedin}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">LinkedIn</a>
  <a href="{{social_twitter}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Twitter</a>
</p>`,
  },
  {
    label: 'Signature / Footer',
    html: `<p style="margin-top:24px;font-size:13px;color:#475569;">
  Best regards,<br/>
  <strong>{{business_name}}</strong><br/>
  {{business_phone}}<br/>
  {{business_website}}<br/>
  {{business_address}}
</p>`,
  },
];

// Starting point for new mail templates / a fresh compose — a complete,
// professionally styled email (header, greeting, message, CTA, social links,
// signature and footer) built from the same merge fields as MAIL_SNIPPETS so
// it re-themes correctly with MailColorPicker and never renders as bare,
// unstyled text.
export const MAIL_DEFAULT_BODY = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:{{color_header}};padding:28px;text-align:center;">
    <img src="{{logo_url}}" alt="{{business_name}}" style="max-height:44px;" />
    <h2 style="margin:8px 0 0;font-family:Arial,sans-serif;color:#ffffff;">{{business_name}}</h2>
  </div>

  <div style="padding:32px 28px;">
    <h2 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:20px;color:{{color_header}};">Hi {{client_name}},</h2>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:{{color_text}};">
      Write your message here. Share an update, an offer, or anything else you'd like {{client_name}} to know.
    </p>

    <p style="text-align:center;margin:28px 0;">
      <a href="{{business_website}}" style="background:{{color_primary}};color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:14px 32px;border-radius:999px;display:inline-block;">Visit Our Website</a>
    </p>

    <p style="margin-top:24px;font-size:13px;color:#475569;">
      Best regards,<br/>
      <strong>{{business_name}}</strong><br/>
      {{business_phone}}<br/>
      {{business_website}}<br/>
      {{business_address}}
    </p>
  </div>

  <div style="text-align:center;padding:16px;border-top:1px solid #e2e8f0;">
    <a href="{{social_instagram}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Instagram</a>
    <a href="{{social_facebook}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Facebook</a>
    <a href="{{social_linkedin}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">LinkedIn</a>
    <a href="{{social_twitter}}" style="color:{{color_primary}};text-decoration:none;font-size:12px;font-weight:bold;margin:0 8px;">Twitter</a>
  </div>

  <p style="text-align:center;font-size:11px;color:#94a3b8;padding:16px 0;margin:0;">
    &copy; {{current_year}} {{business_name}}. All rights reserved.
  </p>
</div>`;

// Pages whose SEO meta tags can be managed from /admin/seo.
// The "key" must match the pageKey passed to useSeoOverride() on each page.
// default* fields mirror the hardcoded <SEOHead> props in each page — shown
// as placeholders until an override is saved.
export const SEO_PAGES = [
  {
    key: 'home', label: 'Home', path: '/',
    defaultTitle: 'SmoothWeb | Portfolio Website Design & Digital Marketing Agency India',
    defaultDescription: 'SmoothWeb is the premier agency for portfolio website design, creative branding, and digital marketing in India. We build high-converting portfolios and ad funnels for visionaries.',
  },
  {
    key: 'about', label: 'About', path: '/about',
    defaultTitle: 'About SmoothWeb | Leading Digital Visiting Card Platform India',
    defaultDescription: 'SmoothWeb is a professional portfolio website agency and digital visiting card platform founded by Akash Mandal. We democratize high-end tech for creators.',
  },
  {
    key: 'services', label: 'Services', path: '/services',
    defaultTitle: 'SEO Services & Digital Marketing Solutions | SmoothWeb',
    defaultDescription: 'Expert SEO services, PPC advertising, and real estate website design. We provide the strategic backbone for digital growth and branding.',
  },
  {
    key: 'portfolio', label: 'Portfolio', path: '/portfolio',
    defaultTitle: 'Portfolio Design Showreel | Web Developer & Photography Portfolios',
    defaultDescription: 'Explore our work in photography portfolio website design, web developer portfolios, and personal branding models. High-retention cinematic digital footprints.',
  },
  {
    key: 'contact', label: 'Contact', path: '/contact',
    defaultTitle: 'Contact SmoothWeb | Professional Portfolio & SEO Consultation',
    defaultDescription: "Connect with India's top portfolio design agency. Book your session for SEO services, PPC growth, or custom digital identity solutions.",
  },
  {
    key: 'book', label: 'Booking', path: '/book',
    defaultTitle: 'Book Strategy Session | Digital Growth & UX Audit',
    defaultDescription: 'Secure your spot for a premium strategy session. We discuss portfolio architecture, ad growth funnels, and digital identity synchronization.',
  },
];
