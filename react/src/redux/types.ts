import store from './store'

export type State = ReturnType<typeof store.getState>

export type InstallState = {
  show: boolean
  deferredPrompt: any
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
