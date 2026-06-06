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

export const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
