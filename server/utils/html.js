const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'span', 'strong',
  'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
]);

const ALLOWED_ATTRS = {
  a: new Set(['href', 'target', 'title', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
};

const BLOCKED_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base',
  'form', 'input', 'button', 'textarea', 'select', 'option',
];

function isSafeUrl(tag, attr, value) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (tag === 'img' && attr === 'src') {
    return /^(https?:\/\/|\/(?!\/)|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(trimmed);
  }

  if (tag === 'a' && attr === 'href') {
    return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(trimmed);
  }

  return true;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeAttributes(tag, attrs = '') {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return '';

  const output = [];
  const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>`=]+))/g;
  let match;

  while ((match = attrRegex.exec(attrs)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? '';

    if (!allowed.has(name)) continue;
    if ((name === 'href' || name === 'src') && !isSafeUrl(tag, name, value)) continue;
    if (name === 'target' && !['_blank', '_self', '_parent', '_top'].includes(value)) continue;

    output.push(`${name}="${escapeAttr(value)}"`);
  }

  if (tag === 'a' && output.some(attr => attr.startsWith('target="_blank"'))) {
    output.push('rel="noopener noreferrer"');
  }

  if (tag === 'img' && !output.some(attr => attr.startsWith('loading='))) {
    output.push('loading="lazy"');
  }

  return output.length ? ` ${output.join(' ')}` : '';
}

export function sanitizeHtml(input) {
  if (input === undefined || input === null) return input;
  if (typeof input !== 'string') return '';

  const blockedPattern = BLOCKED_TAGS.join('|');
  let html = input
    .replace(new RegExp(`<!--([\\s\\S]*?)-->`, 'g'), '')
    .replace(new RegExp(`<\\s*(${blockedPattern})\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`, 'gi'), '')
    .replace(new RegExp(`<\\s*\\/?\\s*(${blockedPattern})\\b[^>]*>`, 'gi'), '');

  html = html.replace(/<\s*(\/?)\s*([a-zA-Z0-9-]+)([^>]*)>/g, (match, closing, rawTag, attrs) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (closing) return `</${tag}>`;
    return `<${tag}${sanitizeAttributes(tag, attrs)}>`;
  });

  return html;
}
