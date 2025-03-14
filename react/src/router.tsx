import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import ReviewListPage from './pages/ReviewListPage'
import SettingsPage from './pages/SettingsPage'
import VenueResultsPage from './pages/VenueResultsPage'

export default createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <App />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'venue',
        element: <VenueResultsPage />,
        children: [
          {
            path: ':id',
          },
        ],
      },
      {
        path: 'review',
        element: <ReviewListPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])
