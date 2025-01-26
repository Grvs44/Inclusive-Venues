import React from 'react'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import MapResultsView from '../containers/MapResultsView'
import { setShowMap } from '../redux/resultsSlice'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { showMap } = useSelector((state: State) => state.results)

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
    dispatch(setShowMap(true))
  }, [])

  return (
    <Container>
      //Filters
      {showMap ? (
        <AzureMapsProvider>
          <MapResultsView />
        </AzureMapsProvider>
      ) : (
        <p>List</p>
      )}
    </Container>
  )
}
