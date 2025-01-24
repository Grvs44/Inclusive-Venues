import React from 'react'
import { Container, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetUserDetailsQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { getDisplayName } from '../redux/utils'
import SearchBox from '../containers/SearchBox'

export default function HomePage() {
  const dispatch = useDispatch()
  const user = useGetUserDetailsQuery()

  React.useEffect(() => {
    dispatch(setTitle('Inclusive Venues'))
  }, [])

  return (
    <Container>
      <Typography variant="h3" component="h2">
        {user.data ? `Welcome, ${getDisplayName(user.data)}!` : 'Welcome!'}
      </Typography>
      <SearchBox/>
    </Container>
  )
}
