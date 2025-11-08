const CONTROL_CHARS = new RegExp(
  `[\\u0000-\\u001F\\u007F-\\u009F]`,
  'g'
)

export function toSafeFilename(str: string, ext: string): string {
  const normalizedExt = ext.startsWith('.') ? ext : `.${ext}`

  // Normalize whitespace and trim
  let base = (str || 'download')
    .trim()
    .replace(/\s+/g, '-')

  // Remove characters that are problematic across filesystems and URLs
  base = base
    .replace(/[^a-zA-Z0-9._-]/g, '-') // keep alnum, dot, underscore, dash
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^\.+/, '') // no leading dots
    .replace(/^[-_]+/, '') // no leading dashes/underscores
    .replace(/\.+$/, '') // no trailing dots
    .replace(/[-_]+$/, '') // no trailing dashes/underscores

  if (!base) {
    base = 'download'
  }

  // Ensure total length (including extension) is reasonable
  const maxLen = 64
  const available = maxLen - normalizedExt.length
  if (base.length > available) {
    base = base.slice(0, available)
  }

  return `${base}${normalizedExt}`
}

/**
 * Sanitize user-provided URL components to keep query params predictable.
 * Removes control characters, collapses whitespace, and truncates long values.
 */
export function sanitizeUrlParam(value: unknown, maxLength = 256): string {
  if (typeof value !== 'string') {
    return ''
  }

  const cleaned = value
    .replace(CONTROL_CHARS, '')
    .trim()
    .replace(/\s+/g, ' ')

  if (!cleaned) {
    return ''
  }

  return cleaned.slice(0, maxLength)
}

/**
 * Sanitize plain text destined for user-facing output or files such as ICS.
 * Optionally preserves newlines while still removing control characters.
 */
export function sanitizePlainText(
  value: unknown,
  {
    maxLength = 512,
    allowNewlines = false,
  }: {
    maxLength?: number
    allowNewlines?: boolean
  } = {}
): string {
  if (typeof value !== 'string') {
    return ''
  }

  let cleaned = value.replace(CONTROL_CHARS, '')

  if (allowNewlines) {
    cleaned = cleaned
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
  } else {
    cleaned = cleaned.replace(/\s+/g, ' ')
  }

  cleaned = cleaned.trim()
  if (!cleaned) {
    return ''
  }

  return cleaned.slice(0, maxLength)
}
