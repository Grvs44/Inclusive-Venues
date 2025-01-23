import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
import { User, UserLogin } from './types'

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
  tagTypes: [],
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
  }),
})

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
} = apiSlice
