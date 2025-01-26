import React from 'react'
import Container from '@mui/material/Container'
import { useDispatch, useSelector } from 'react-redux'
import MapResultsView from '../containers/MapResultsView'
import { setMap } from '../redux/resultsSlice'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { showMap } = useSelector((state: State) => state.results)

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
    dispatch(setMap(true))
  }, [])

  return (
    <Container>
      //Filters
      {showMap ? <MapResultsView /> : <p>List</p>}
    </Container>
  )
}
