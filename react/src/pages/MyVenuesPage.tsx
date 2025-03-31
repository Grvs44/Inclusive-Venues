import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import ErrorBox from '../components/ErrorBox'
import NewVenueFab from '../components/NewVenueFab'
import MyVenuesList from '../containers/MyVenuesList'
import NewVenueDialog from '../containers/NewVenueDialog'
import { useGetUserDetailsQuery, useGetVenuesQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

export default function MyVenuesPage() {
  const dispatch = useDispatch()
  const [page, setPage] = React.useState<number>(1)
  const [venueOpen, setVenueOpen] = React.useState<boolean>(false)
  const [venueId, setVenueId] = React.useState<number | undefined>(undefined)
  const user = useGetUserDetailsQuery()
  const { data, error, isError, isFetching, refetch } = useGetVenuesQuery(
    { page, my: true },
    { skip: !user.data },
  )

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

  return user.data ? (
    <Container>
      {isError ? (
        <ErrorBox error={error} retry={refetch} />
      ) : (
        <>
          <MyVenuesList
            data={data}
            isFetching={isFetching}
            onClick={editVenue}
          />
          {!isFetching && data?.next ? (
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
      <NewVenueDialog
        open={venueOpen}
        onClose={() => setVenueOpen(false)}
        venueId={venueId}
      />
    </Container>
  ) : user.isFetching ? (
    <Container>
      <CircularProgress />
    </Container>
  ) : (
    <Container>
      <Typography>Sign in to view your reviews</Typography>
    </Container>
  )
}
