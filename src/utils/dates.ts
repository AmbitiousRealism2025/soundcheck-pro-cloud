import { format, parseISO } from 'date-fns'

export function fmtDate(iso: string) {
  try {
    return format(parseISO(iso), 'MMM d, yyyy h:mma')
  } catch {
    return iso
  }
}
