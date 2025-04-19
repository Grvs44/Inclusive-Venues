import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const licenseSlice = createApi({
  reducerPath: 'license',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.BASE_URL }),
  tagTypes: ['license'],
  keepUnusedDataFor: Infinity,
  endpoints: (builder) => ({
    getLicense: builder.query<string, void>({
      query: () => ({
        url: 'licenses.txt',
        responseHandler: (response) => response.text(),
      }),
      providesTags: [{ type: 'license' }],
    }),
  }),
})

export const { useGetLicenseQuery } = licenseSlice
