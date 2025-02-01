import store from './store'

export type State = ReturnType<typeof store.getState>

export type InstallState = {
  show: boolean
  deferredPrompt?: Event
}

export type TitleState = {
  title: string
}

export type ResultsState = {
  showMap: boolean
}

export type LoggedInUser = {
  firstName: string
  lastName: string
  username: string
}

export type User = LoggedInUser | null

export type UserLogin = {
  username: string
  password: string
}

export interface Entity {
  id: number
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/types.ts
export interface PageState<T> {
  results: T[]
  count: number
  next: string | null
}

export type ListVenue = {
  id: number
  name: string
  longitude: number
  latitude: number
  score?: number
}

export type Venue = ListVenue & {
  description: string
  address?: string
  subcategory: number
  images?: Image[]
}

export type VenueQuery = {
  page?: number
  // TODO: other filters
}

export type Image = {
  id: number
  alt: string
  src: string
}
