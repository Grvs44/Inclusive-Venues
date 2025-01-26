import React from 'react'
import { Container, Stack, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import SearchCard from '../containers/SearchCard'
import { useGetUserDetailsQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { getDisplayName } from '../redux/utils'

export default function HomePage() {
  const dispatch = useDispatch()
  const user = useGetUserDetailsQuery()

  React.useEffect(() => {
    dispatch(setTitle('Inclusive Venues'))
  }, [])

  return (
    <Container>
      <Stack sx={{ alignItems: 'center' }} spacing={3}>
        <Typography variant="h3" component="h2">
          {user.data ? `Welcome, ${getDisplayName(user.data)}!` : 'Welcome!'}
        </Typography>
        <SearchCard />
      </Stack>
    </Container>
  )
}
