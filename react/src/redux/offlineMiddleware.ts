// Adapted from https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const offlineMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (
      isRejectedWithValue(action) &&
      (action.payload as any)?.status == 'FETCH_ERROR'
    ) {
      toast.error(
        'You are currently offline, please check your connection and try again',
        { duration: 5000 },
      )
    }

    return next(action)
  }

export default offlineMiddleware
