import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import installReducer from './installSlice'
import offlineMiddleware from './offlineMiddleware'
import resultsReducer from './resultsSlice'
import titleReducer from './titleSlice'

export default configureStore({
  reducer: {
    install: installReducer,
    results: resultsReducer,
    title: titleReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/store.ts
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['install/setDeferredPrompt'],
        ignoredPaths: ['install.deferredPrompt'],
      },
    }).concat(apiSlice.middleware, offlineMiddleware),
})
