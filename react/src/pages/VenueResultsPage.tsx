import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import ListResultsView from '../containers/ListResultsView'
import MapResultsView from '../containers/MapResultsView'
import ResultsFilters from '../containers/ResultsFilters'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { incrementPage } from '../redux/resultsSlice'
import { setTitle } from '../redux/titleSlice'
import type { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { showMap, page } = useSelector((state: State) => state.results)
  const { data, isLoading } = useGetVenuesQuery({ page })

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
  }, [])

  return (
    <Container>
      <ResultsFilters />
      {showMap ? (
        <AzureMapsProvider>
          <MapResultsView data={data} isLoading={isLoading} />
        </AzureMapsProvider>
      ) : (
        <ListResultsView data={data} isLoading={isLoading} />
      )}
      {data?.next ? (
        <Button variant="contained" onClick={() => dispatch(incrementPage())}>
          Load more
        </Button>
      ) : null}
    </Container>
  )
}
