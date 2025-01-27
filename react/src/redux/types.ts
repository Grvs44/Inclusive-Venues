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

export type ListVenue = {
  id: number
  name: string
  longitude: number
  latitude: number
  rating?: number
}
