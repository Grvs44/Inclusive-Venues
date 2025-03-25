import React from 'react'
import Box from '@mui/material/Box'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'
import { setDeferredPrompt, setShow } from './redux/installSlice'

export default function App() {
  const dispatch = useDispatch()

  // Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/App.tsx
  React.useEffect(
    () =>
      window.addEventListener('beforeinstallprompt', (event: Event) => {
        dispatch(setShow(true))
        dispatch(setDeferredPrompt(event))
      }),
    [],
  )

  return (
    <div>
      <TopBar />
      <Toaster />
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </div>
  )
}
