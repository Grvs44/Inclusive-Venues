import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import type {
  CreateReview,
  Image,
  ListVenue,
  NewVenue,
  PageState,
  Review,
  ReviewQuery,
  UpdateReview,
  User,
  UserLogin,
  Venue,
  VenueCategory,
  VenueQuery,
  VenueReviewQuery,
  VenueSubcategory,
} from './types'
import { getFilterQuery } from './utils'

const LIST = -1

// Pagination functions adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
const nullNumber = (value: string | null) => (value ? Number(value) : Infinity)

const getPage = ({ next }: PageState<any>) =>
  next
    ? nullNumber(new URLSearchParams(next.slice(next.indexOf('?'))).get('page'))
    : Infinity

const merge = <T>(currentCache: PageState<T>, responseData: PageState<T>) => {
  if (
    currentCache.count === responseData.count &&
    getPage(currentCache) < getPage(responseData)
  ) {
    currentCache.results.push(...responseData.results)
  } else {
    currentCache.results = responseData.results
  }
  currentCache.next = responseData.next
  currentCache.count = responseData.count
}

const serializeQueryArgs = ({ endpointName }: { endpointName: string }) =>
  endpointName

const forceRefetch = <T>({
  currentArg,
  previousArg,
}: {
  currentArg: T
  previousArg: T
}) => currentArg !== previousArg
// End of pagination functions

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.BASE_URL + import.meta.env.VITE_API_URL,
    // prepareHeaders adapted from https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
    prepareHeaders(headers) {
      const csrfToken = Cookies.get('csrftoken')
      if (csrfToken) headers.set('X-CSRFToken', csrfToken)
    },
  }),
  tagTypes: ['user', 'venuecat', 'venuesub', 'venue', 'review'],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    // Authentication
    getUserDetails: builder.query<User, void>({
      query: () => 'user',
      providesTags: ['user'],
      keepUnusedDataFor: 60000,
    }),
    login: builder.mutation<void, UserLogin>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        const query = await queryFulfilled
        dispatch(
          apiSlice.util.updateQueryData(
            'getUserDetails',
            undefined,
            () => query.data,
          ),
        )
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(
          apiSlice.util.updateQueryData(
            'getUserDetails',
            undefined,
            () => null,
          ),
        )
      },
    }),

    // Venue categories
    getVenueCategories: builder.query<VenueCategory[], void>({
      query: () => 'venuecat',
      providesTags: [{ type: 'venuecat', id: LIST }],
    }),

    // Venue subcategories
    getVenueSubcategories: builder.query<VenueSubcategory[], number>({
      query: (id) => 'venuesub?category=' + id,
      providesTags: (_r, _e, arg) => [{ type: 'venuesub', id: arg }],
    }),

    // Venues
    getVenues: builder.query<PageState<ListVenue>, VenueQuery>({
      query: (filters) => 'venue' + getFilterQuery(filters),
      providesTags: [{ type: 'venue', id: LIST }],
      serializeQueryArgs,
      merge,
      forceRefetch,
    }),
    getVenue: builder.query<Venue, string | number | undefined>({
      query: (id) => `venue/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'venue', id: result.id }] : [],
    }),
    getVenueReview: builder.query<Review | null, number | undefined>({
      query: (id) => `venue/${id}/review`,
      providesTags: (_r, _e, id) => [{ type: 'review', id }],
    }),
    getVenueReviews: builder.query<PageState<Review>, VenueReviewQuery>({
      query: ({ id, ...filters }) =>
        `venue/${id}/reviews` + getFilterQuery(filters),
      serializeQueryArgs,
      merge,
      forceRefetch,
    }),
    createVenue: builder.mutation<Venue, NewVenue>({
      query: (body) => ({
        url: 'venue',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'venue', id: LIST }],
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        const query = await queryFulfilled
        dispatch(
          apiSlice.util.upsertQueryData('getVenue', query.data.id, query.data),
        )
      },
    }),

    // Reviews
    getReviews: builder.query<PageState<Review>, ReviewQuery>({
      query: (filters) => 'review' + getFilterQuery(filters),
      providesTags: [{ type: 'review', id: LIST }],
      serializeQueryArgs,
      merge,
      forceRefetch,
    }),
    createReview: builder.mutation<Review, CreateReview>({
      query: (body) => ({
        url: 'review',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'review', id: LIST }],
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        const query = await queryFulfilled
        dispatch(
          apiSlice.util.upsertQueryData(
            'getVenueReview',
            query.data.venue,
            query.data,
          ),
        )
      },
    }),
    updateReview: builder.mutation<Review, UpdateReview>({
      query: ({ id, ...body }) => ({
        url: `review/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'review', id: LIST }],
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        const query = await queryFulfilled
        dispatch(
          apiSlice.util.upsertQueryData(
            'getVenueReview',
            query.data.venue,
            query.data,
          ),
        )
      },
    }),

    // Images
    createImage: builder.mutation<Image, FormData>({
      query: (body) => ({
        url: 'image',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetVenueCategoriesQuery,
  useGetVenueSubcategoriesQuery,
  useGetVenuesQuery,
  useGetVenueQuery,
  useGetVenueReviewQuery,
  useGetVenueReviewsQuery,
  useCreateVenueMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useCreateImageMutation,
} = apiSlice
