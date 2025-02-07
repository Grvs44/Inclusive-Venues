import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListResultsView from '../containers/ListResultsView'
import MapResultsView from '../containers/MapResultsView'
import ResultsFilters from '../containers/ResultsFilters'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { incrementPage } from '../redux/resultsSlice'
import { setTitle } from '../redux/titleSlice'
import type { State } from '../redux/types'
import VenueOutlet from '../containers/VenueOutlet'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { showMap, page } = useSelector((state: State) => state.results)
  const { data, isLoading } = useGetVenuesQuery({ page })

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
  }, [id])

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
      <VenueOutlet id={id} />
      {data?.next ? (
        <Button variant="contained" onClick={() => dispatch(incrementPage())}>
          Load more
        </Button>
      ) : null}
    </Container>
  )
}
