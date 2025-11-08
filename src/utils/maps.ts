export function directionsLink(destination: string, origin?: string) {
  const base = 'https://www.google.com/maps/dir/?api=1'
  const params = new URLSearchParams({ destination })
  if (origin) params.set('origin', origin)
  return `${base}&${params.toString()}`
}
