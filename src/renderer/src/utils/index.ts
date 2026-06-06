import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const formatDateFromMs = (ms: number) => {
  const date = new Date(ms)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString(window.context.locale, {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return date.toLocaleDateString(window.context.locale, {
    month: 'short',
    day: 'numeric'
  })
}

export const formatNoteMetadata = (createdMs: number, updatedMs: number) => {
  const created = new Date(createdMs)

  const lastEdited = formatDateFromMs(updatedMs)

  return `Created ${created.toLocaleDateString(window.context.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })} • Last edited ${lastEdited}`
}

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
