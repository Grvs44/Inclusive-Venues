import React from 'react'
import Container from '@mui/material/Container'
import { useDispatch, useSelector } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { showMap } = useSelector((state: State) => state.results)

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
  }, [])

  return (
    <Container>
      //Filters
      {showMap ? <p>Map</p> : <p>List</p>}
    </Container>
  )
}
