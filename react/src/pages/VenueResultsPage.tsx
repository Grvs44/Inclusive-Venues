import React from 'react'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import ListResultsView from '../containers/ListResultsView'
import MapResultsView from '../containers/MapResultsView'
import ResultsFilters from '../containers/ResultsFilters'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { showMap } = useSelector((state: State) => state.results)
  const { data } = useGetVenuesQuery({})

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
  }, [])

  return (
    <Container>
      <ResultsFilters />
      {showMap ? (
        <AzureMapsProvider>
          <MapResultsView results={data?.results} />
        </AzureMapsProvider>
      ) : (
        <ListResultsView results={data?.results} />
      )}
    </Container>
  )
}
