import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import type {
  CreateReview,
  ListVenue,
  PageState,
  Review,
  ReviewQuery,
  UpdateReview,
  User,
  UserLogin,
  Venue,
  VenueQuery,
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
  tagTypes: ['user', 'venue', 'review'],
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

    // Venues
    getVenues: builder.query<PageState<ListVenue>, VenueQuery>({
      query: (filters) => 'venue' + getFilterQuery(filters),
      providesTags: [{ type: 'venue', id: LIST }],
      serializeQueryArgs,
      merge,
      forceRefetch,
    }),
    getVenue: builder.query<Venue, any>({
      query: (id) => `venue/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'venue', id: result.id }] : [],
    }),
    getVenueReview: builder.query<Review | null, any>({
      query: (id) => `venue/${id}/review`,
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
    }),
    updateReview: builder.mutation<Review, UpdateReview>({
      query: ({ id, ...body }) => ({
        url: `review/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'review', id: LIST }],
    }),
  }),
})

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetVenuesQuery,
  useGetVenueQuery,
  useGetVenueReviewQuery,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
} = apiSlice
