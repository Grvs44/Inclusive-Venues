import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ErrorBox from '../components/ErrorBox'
import NewVenueFab from '../components/NewVenueFab'
import ListResultsView from '../containers/ListResultsView'
import MapResultsView from '../containers/MapResultsView'
import NewVenueDialog from '../containers/NewVenueDialog'
import ResultsFilters from '../containers/ResultsFilters'
import ReviewDialog from '../containers/ReviewDialog'
import VenueDetailDialog from '../containers/VenueDetailDialog'
import { useFilters } from '../providers/FilterProvider'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import type { State } from '../redux/types'

export default function VenueResultsPage() {
  const dispatch = useDispatch()
  const filters = useFilters()
  const filterSelection = filters?.getFilters()
  const { id } = useParams()
  const { showMap } = useSelector((state: State) => state.results)
  const [page, setPage] = React.useState<number>(1)
  const [detailOpen, setDetailOpen] = React.useState<boolean>(false)
  const [detailId, setDetailId] = React.useState<number | undefined>(undefined)
  const [reviewOpen, setReviewOpen] = React.useState<boolean>(false)
  const [newVenueOpen, setNewVenueOpen] = React.useState<boolean>(false)
  const { data, isFetching, error, isError, refetch } = useGetVenuesQuery({
    page,
    ...filterSelection,
  })

  const onItemClick = (venueId: number) => {
    setDetailId(venueId)
    setDetailOpen(true)
  }

  React.useEffect(() => {
    dispatch(setTitle('Venues'))
    const venueId = Number(id)
    if (isNaN(venueId)) return
    setDetailId(venueId)
    setDetailOpen(true)
    history.replaceState(null, '', '/venue')
  }, [])

  React.useEffect(() => {
    if (isError) console.error(error)
  }, [isError])

  // Reset page on filter change to prevent 404
  React.useEffect(() => setPage(1), [filterSelection])

  return (
    <Container>
      <ResultsFilters />
      {isError ? (
        <ErrorBox error={error} retry={refetch} />
      ) : showMap ? (
        <AzureMapsProvider>
          <MapResultsView
            data={data}
            isFetching={isFetching}
            onClick={onItemClick}
          />
        </AzureMapsProvider>
      ) : (
        <ListResultsView
          data={data}
          isFetching={isFetching}
          onClick={onItemClick}
        />
      )}
      {!isError && data?.next ? (
        <Button variant="contained" onClick={() => setPage((page) => page + 1)}>
          Load more
        </Button>
      ) : null}
      <NewVenueFab onClick={() => setNewVenueOpen(true)} />
      <VenueDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        id={detailId}
        openReview={() => setReviewOpen(true)}
      />
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        venueId={detailId}
      />
      <NewVenueDialog
        open={newVenueOpen}
        onClose={() => setNewVenueOpen(false)}
      />
    </Container>
  )
}
