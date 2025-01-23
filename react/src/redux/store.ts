import { configureStore } from '@reduxjs/toolkit'
import installReducer from './installSlice'
import titleReducer from './titleSlice'
import { apiSlice } from './apiSlice'

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/store.ts
export default configureStore({
  reducer: {
    install: installReducer,
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
