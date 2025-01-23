export type InstallState = {
  show: boolean
  deferredPrompt: any
}

export type TitleState = {
  title: string
}

export type User = {
  firstName: string
  lastName: string
  username: string
} | null

export type UserLogin = {
  username: string
  password: string
}
