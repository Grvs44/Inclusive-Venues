import type { ApiError, LoggedInUser, Venue } from './types'

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

export const getErrorMessage = (error?: ApiError) => {
  if (error == undefined) {
    return 'Unkown error'
  } else if ('data' in error && error.data) {
    if (Array.isArray(error.data)) {
      return error.data[0]
    } else if (typeof error.data == 'string') {
      return Document.parseHTMLUnsafe(error.data).documentElement.innerText
    } else if (typeof error.data == 'object' && 'detail' in error.data) {
      return error.data.detail
    }
  } else if ('error' in error) {
    return error.error
  } else if ('status' in error) {
    switch (error.status) {
      case 403:
        return "You don't have permission to perform this action"
      case 404:
        return 'Not found'
      case 500:
        return 'Server error'
      default:
        return `Unknown error (${error.status})`
    }
  }
  return 'Unknown error'
}
