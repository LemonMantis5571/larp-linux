/** Quote for CSS url("…"); encode path chars like @ that break unquoted url(). */
export function normalizeWallUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.startsWith('blob:') || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
    return trimmed
  }
  try {
    const u = new URL(trimmed)
    u.pathname = u.pathname
      .split('/')
      .map((seg) => {
        try {
          return encodeURIComponent(decodeURIComponent(seg))
        } catch {
          return encodeURIComponent(seg)
        }
      })
      .join('/')
    return u.toString()
  } catch {
    return trimmed
  }
}

export function cssBgUrl(url: string): string {
  const safe = normalizeWallUrl(url).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `url("${safe}")`
}

/** Hosts known to block hotlinking from other origins (Referer check). */
export function hotlinkLikelyBlocked(url: string): boolean {
  try {
    const h = new URL(url).hostname
    return /(^|\.)uhdpaper\.com$/i.test(h) || /(^|\.)image-\d+\.uhdpaper\.com$/i.test(h)
  } catch {
    return false
  }
}

export function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.referrerPolicy = 'no-referrer'
    img.src = normalizeWallUrl(url)
  })
}
