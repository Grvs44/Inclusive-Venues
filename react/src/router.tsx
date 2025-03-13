import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import LoginTestPage from './pages/LoginTestPage'
import ReviewListPage from './pages/ReviewListPage'
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
        path: 'logintest',
        element: <LoginTestPage />,
      },
    ],
  },
])
