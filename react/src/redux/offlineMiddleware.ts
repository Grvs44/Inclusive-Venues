// Adapted from https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

const offlineMessage =
  'You are currently offline, please check your connection and try again'

const offlineMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (
      isRejectedWithValue(action) &&
      (action.payload as any)?.status == 'FETCH_ERROR'
    ) {
      ;(action.payload as any).error = offlineMessage
    }

    return next(action)
  }

export default offlineMiddleware
