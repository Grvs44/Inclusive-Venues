import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListResultsView from '../containers/ListResultsView'
import MapResultsView from '../containers/MapResultsView'
import ResultsFilters from '../containers/ResultsFilters'
import VenueOutlet from '../containers/VenueOutlet'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import type { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { showMap } = useSelector((state: State) => state.results)
  const [page, setPage] = React.useState<number>(1)
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
        <Button variant="contained" onClick={() => setPage((page) => page + 1)}>
          Load more
        </Button>
      ) : null}
    </Container>
  )
}
