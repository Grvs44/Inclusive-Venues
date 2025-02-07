import type { LoggedInUser, Venue } from './types'

export const getDisplayName = (user: LoggedInUser) =>
  user.firstName ? user.firstName : user.username

export const openMaps = (venue: Venue) => {
  open(`https://www.google.com/maps/@${venue.latitude},${venue.longitude},18z`)
}

export const getFilterQuery = (filters: Object) => {
  const entries = Object.entries(filters).filter((e) => e[1] != undefined)
  if (entries.length == 0) return ''
  return '?' + new URLSearchParams(entries).toString()
}
