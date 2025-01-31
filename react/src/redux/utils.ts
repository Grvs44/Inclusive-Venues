import { LoggedInUser, Venue } from './types'

export const getDisplayName = (user: LoggedInUser) =>
  user.firstName ? user.firstName : user.username

export const openMaps = (venue: Venue) => {
  open(`https://www.google.com/maps/@${venue.latitude},${venue.longitude},18z`)
}
