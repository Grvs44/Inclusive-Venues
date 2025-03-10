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

export type VenueCategory = {
  id: number
  name: string
}

export type VenueSubcategory = VenueCategory & {
  category: number
}

export type ListVenue = {
  id: number
  name: string
  longitude: number
  latitude: number
  score?: string
  distance?: string
}

export type Venue = {
  id: number
  name: string
  longitude: number
  latitude: number
  score?: string
  description: string
  address?: string
  subcategory: number
  map: string | null
  images?: VenueImage[]
}

export type NewVenue = {
  name: string
  longitude: number
  latitude: number
  description: string
  address?: string
  subcategory: number
}

export interface PageQuery {
  page?: number
}

export type VenueQuery = PageQuery & {
  // TODO: other filters
}

export type VenueImage = {
  id: number
  alt: string
  src: string
}

export type Image = VenueImage & {
  venue: number
  order: number
}

export type RatingCategory = {
  id: number
  name: string
  description: string
}

export type Review = {
  id: number
  venue: number
  venueName: string
  body: string
  ratings: ListRating[]
}

export type CreateReview = {
  venue: number
  body: string
  ratings: ListRating[]
}

export type UpdateReview = {
  id: number // ID of Review to update
  body: string
  ratings: ListRating[]
}

export type ListRating = {
  id?: number
  category: number
  value: number
}

export type ReviewQuery = PageQuery & {
  // TODO: other filters
}

export type VenueReviewQuery = Entity & ReviewQuery
