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
  tagTypes: ['user'],
  endpoints: (builder) => ({
    // Authentication
    getUserDetails: builder.query<User, void>({
      query: () => 'user',
      providesTags: () => [{ type: 'user' }],
    }),
    login: builder.mutation<void, UserLogin>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [{ type: 'user' }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      invalidatesTags: () => [{ type: 'user' }],
    }),
  }),
})

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
} = apiSlice
