// Replaces {{merge_field}} placeholders in mail template subjects/bodies with
// real values from the selected client, the Settings sheet (Business &
// Branding section), and the chosen template theme colors. Used by the Mail
// compose/template editor for live previews and for the final email sent to
// the client.
export const DEFAULT_MAIL_COLORS = {
  primary: '#6366f1',
  header: '#0f172a',
  text: '#1e293b',
};

export function resolveMergeFields(text, { client, settings, colors } = {}) {
  const c = { ...DEFAULT_MAIL_COLORS, ...colors };
  const primary = c.primary || DEFAULT_MAIL_COLORS.primary;
  const header = c.header || DEFAULT_MAIL_COLORS.header;
  const txt = c.text || DEFAULT_MAIL_COLORS.text;

  const map = {
    '{{client_name}}': client?.Name || 'there',
    '{{client_email}}': client?.Email || '',
    '{{business_name}}': settings?.BUSINESS_NAME || settings?.SITE_NAME || 'Our Team',
    '{{business_website}}': settings?.BUSINESS_WEBSITE || '',
    '{{business_phone}}': settings?.BUSINESS_PHONE || '',
    '{{business_address}}': settings?.BUSINESS_ADDRESS || '',
    '{{logo_url}}': settings?.LOGO_URL || '',
    '{{social_instagram}}': settings?.SOCIAL_INSTAGRAM || '',
    '{{social_facebook}}': settings?.SOCIAL_FACEBOOK || '',
    '{{social_linkedin}}': settings?.SOCIAL_LINKEDIN || '',
    '{{social_twitter}}': settings?.SOCIAL_TWITTER || '',
    '{{social_youtube}}': settings?.SOCIAL_YOUTUBE || '',
    '{{current_year}}': String(new Date().getFullYear()),
    '{{color_primary}}': primary,
    '{{color_header}}': header,
    '{{color_text}}': txt,
    // Older templates (saved before theme colors existed) have these
    // hex codes hardcoded instead of {{color_*}} merge fields. Re-theme
    // them too so the color pickers also affect existing templates.
    [DEFAULT_MAIL_COLORS.primary]: primary,
    [DEFAULT_MAIL_COLORS.header]: header,
    [DEFAULT_MAIL_COLORS.text]: txt,
  };

  return Object.keys(map).reduce(
    (acc, key) => acc.split(key).join(map[key]),
    text || ''
  );
}
