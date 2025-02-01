import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import type {
  ListVenue,
  PageState,
  User,
  UserLogin,
  Venue,
  VenueQuery,
} from './types'
import { getFilterQuery } from './utils'

const LIST = -1

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.BASE_URL + import.meta.env.VITE_API_URL,
    // prepareHeaders adapted from https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
    prepareHeaders(headers) {
      const csrfToken = Cookies.get('csrftoken')
      if (csrfToken) headers.set('X-CSRFToken', csrfToken)
    },
  }),
  tagTypes: ['venue'],
  endpoints: (builder) => ({
    // Authentication
    getUserDetails: builder.query<User, void>({
      query: () => 'user',
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
      providesTags: () => [{ type: 'venue', id: LIST }],
    }),
    getVenue: builder.query<Venue, any>({
      query: (id) => `venue/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'venue', id: result.id }] : [],
    }),
  }),
})

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetVenuesQuery,
  useGetVenueQuery,
} = apiSlice
