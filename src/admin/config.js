// PASTE YOUR DEPLOYED APPS SCRIPT WEB APP URL HERE (see admin-backend/README.md)
export const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwh-tVtWZTdnyipTlzgepTSm8aXE_twyLrNrplungk7czya6nZqCAUi_xL2Qe_XhDZQ/exec";

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
