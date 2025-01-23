import React from 'react'
import Box from '@mui/material/Box'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'
import { setDeferredPrompt, setShow } from './redux/installSlice'

export default function App() {
  const dispatch = useDispatch()

  // Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/App.tsx
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault()
    dispatch(setShow(true))
    dispatch(setDeferredPrompt(event))
  })

  return (
    <div>
      <TopBar />
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </div>
  )
}
