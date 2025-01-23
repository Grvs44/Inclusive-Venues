import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import LoginTestPage from './pages/LoginTestPage'

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
        path: 'logintest',
        element: <LoginTestPage />,
      },
    ],
  },
])
