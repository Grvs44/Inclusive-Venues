import React from 'react'
import { Container, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function SettingsPage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Settings'))
  }, [])

  return (
    <Container>
      <Typography variant="h6" component="p">
        Settings page not yet implemented
      </Typography>
      <hr />
      <Typography color="textSecondary">
        Version {import.meta.env.VITE_VERSION} by Elli Greaves (2025)
      </Typography>
    </Container>
  )
}
