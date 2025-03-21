import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import ReviewDialog from '../containers/ReviewDialog'
import ReviewList from '../containers/ReviewList'
import VenueDetailDialog from '../containers/VenueDetailDialog'
import { useGetReviewsQuery, useGetUserDetailsQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { Review } from '../redux/types'

export default function ReviewListPage() {
  const dispatch = useDispatch()
  const [reviewOpen, setReviewOpen] = React.useState<boolean>(false)
  const [venueId, setVenueId] = React.useState<number | undefined>(undefined)
  const [venueOpen, setVenueOpen] = React.useState<boolean>(false)
  const [page, setPage] = React.useState<number>(1)
  const { data, isFetching } = useGetReviewsQuery({ page })
  const user = useGetUserDetailsQuery()

  const onOpenVenue = (venueId: number) => {
    setVenueId(venueId)
    setVenueOpen(true)
  }

  const onEdit = (review: Review) => {
    setVenueId(review.venue)
    setReviewOpen(true)
  }

  React.useEffect(() => {
    dispatch(setTitle('My reviews'))
  }, [])

  return user?.data ? (
    <Container>
      <ReviewList
        data={data}
        isFetching={isFetching}
        onEdit={onEdit}
        onOpenVenue={onOpenVenue}
      />
      {data?.next ? (
        <Button variant="contained" onClick={() => setPage((page) => page + 1)}>
          Load more
        </Button>
      ) : null}
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        venueId={venueId}
      />
      <VenueDetailDialog
        open={venueOpen}
        onClose={() => setVenueOpen(false)}
        openReview={() => setReviewOpen(true)}
        id={venueId}
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
