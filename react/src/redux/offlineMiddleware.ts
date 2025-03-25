// Adapted from https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

const offlineMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (
      isRejectedWithValue(action) &&
      (action.payload as any)?.status == 'FETCH_ERROR'
    ) {
      alert('Offline')
    }

    return next(action)
  }

export default offlineMiddleware
