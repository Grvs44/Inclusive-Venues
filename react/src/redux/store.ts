import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import pwaReducer from './pwaSlice'
import resultsReducer from './resultsSlice'
import titleReducer from './titleSlice'

export default configureStore({
  reducer: {
    pwa: pwaReducer,
    results: resultsReducer,
    title: titleReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/store.ts
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['pwa/setDeferredPrompt'],
        ignoredPaths: ['pwa.deferredPrompt'],
      },
    }).concat(apiSlice.middleware),
})
