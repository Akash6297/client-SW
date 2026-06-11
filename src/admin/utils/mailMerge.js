// Replaces {{merge_field}} placeholders in mail template subjects/bodies with
// real values from the selected client and the Settings sheet (Business &
// Branding section). Used by the Mail compose/template editor for live
// previews and for the final email sent to the client.
export function resolveMergeFields(text, { client, settings } = {}) {
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
  };

  return Object.keys(map).reduce(
    (acc, key) => acc.split(key).join(map[key]),
    text || ''
  );
}
