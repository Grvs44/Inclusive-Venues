import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import NewVenueFab from '../components/NewVenueFab'
import MyVenuesList from '../containers/MyVenuesList'
import NewVenueDialog from '../containers/NewVenueDialog'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { getErrorMessage } from './VenueResultsPage'

export default function MyVenuesPage() {
  const dispatch = useDispatch()
  const [page, setPage] = React.useState<number>(1)
  const [venueOpen, setVenueOpen] = React.useState<boolean>(false)
  const [venueId, setVenueId] = React.useState<number | undefined>(undefined)
  const { data, error, isError, isFetching } = useGetVenuesQuery({
    page,
    my: true,
  })

  React.useEffect(() => {
    dispatch(setTitle('My venues'))
  }, [])

  const newVenue = () => {
    setVenueId(undefined)
    setVenueOpen(true)
  }

  const editVenue = (venueId: number) => {
    setVenueId(venueId)
    setVenueOpen(true)
  }
  
  return (
    <Container>
      {isError ? (
        <Box>
          <Typography component="h2" variant="h4">
            Error
          </Typography>
          <Typography>{getErrorMessage(error)}</Typography>
        </Box>
      ) : (
        <>
          <MyVenuesList
            data={data}
            isFetching={isFetching}
            onClick={editVenue}
          />
          {data?.next ? (
            <Button
              variant="contained"
              onClick={() => setPage((page) => page + 1)}
            >
              Load more
            </Button>
          ) : null}
        </>
      )}
      <NewVenueFab onClick={newVenue} />
      <NewVenueDialog open={venueOpen} onClose={() => setVenueOpen(false)} />
    </Container>
  )
}
