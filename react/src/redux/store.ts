import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import installReducer from './installSlice'
import { resultsSlice } from './resultsSlice'
import titleReducer from './titleSlice'

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/store.ts
export default configureStore({
  reducer: {
    install: installReducer,
    results: resultsSlice,
    title: titleReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['install/setDeferredPrompt'],
        ignoredPaths: ['install.deferredPrompt'],
      },
    }).concat(apiSlice.middleware),
})
