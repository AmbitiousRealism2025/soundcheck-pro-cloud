import { format, parseISO } from 'date-fns'

export function fmtDate(iso: string, fmt: string = 'MMM d, yyyy h:mma') {
  try {
    return format(parseISO(iso), fmt)
  } catch {
    return iso
  }
}

export { compareISO, inRange, isUpcoming, toTimestamp } from './dateUtils'
