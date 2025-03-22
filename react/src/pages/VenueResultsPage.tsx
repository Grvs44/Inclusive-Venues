import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Fab, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AzureMapsProvider } from 'react-azure-maps'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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
  const { data, isFetching, error, isError } = useGetVenuesQuery({
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
        <Box>
          <Typography component="h2" variant="h4">
            Error
          </Typography>
          <Typography>
            {'status' in error ? `Code ${error.status}` : 'Unknown error'}
          </Typography>
        </Box>
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
      {data?.next ? (
        <Button variant="contained" onClick={() => setPage((page) => page + 1)}>
          Load more
        </Button>
      ) : null}
      <Fab
        // Fab adapted from https://mui.com/material-ui/react-floating-action-button/
        color="primary"
        onClick={() => setNewVenueOpen(true)}
        variant="extended"
        sx={{ position: 'fixed', right: 16, bottom: 16 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        New venue
      </Fab>
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
