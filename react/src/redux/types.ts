import store from './store'

export type State = ReturnType<typeof store.getState>

export type InstallState = {
  show: boolean
  deferredPrompt?: Event
}

export type TitleState = {
  title: string
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
