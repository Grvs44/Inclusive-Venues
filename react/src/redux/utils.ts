import { LoggedInUser } from './types'

export const getDisplayName = (user: LoggedInUser) =>
  user.firstName ? user.firstName : user.username
