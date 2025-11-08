const getTimestamp = (iso: string): number | null => {
  if (!iso) {
    return null
  }

  const time = new Date(iso).getTime()
  return Number.isNaN(time) ? null : time
}

export const compareISO = (a: string, b: string): number => {
  const aTime = getTimestamp(a)
  const bTime = getTimestamp(b)

  if (aTime === null && bTime === null) {
    return 0
  }

  if (aTime === null) {
    return 1
  }

  if (bTime === null) {
    return -1
  }

  return aTime - bTime
}

export const isUpcoming = (iso: string, now: number = Date.now()): boolean => {
  const timestamp = getTimestamp(iso)
  return timestamp !== null && timestamp >= now
}

export const inRange = (iso: string, start: string, end: string): boolean => {
  const timestamp = getTimestamp(iso)
  const startTime = getTimestamp(start)
  const endTime = getTimestamp(end)

  if (timestamp === null || startTime === null || endTime === null) {
    return false
  }

  return timestamp >= startTime && timestamp <= endTime
}

export const toTimestamp = (iso: string): number | null => getTimestamp(iso)
