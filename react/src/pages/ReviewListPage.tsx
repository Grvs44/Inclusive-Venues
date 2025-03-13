import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useDispatch } from 'react-redux'
import ReviewDialog from '../containers/ReviewDialog'
import ReviewList from '../containers/ReviewList'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { Review } from '../redux/types'

export default function ReviewListPage() {
  const dispatch = useDispatch()
  const [reviewOpen, setReviewOpen] = React.useState<boolean>(false)
  const [venueId, setVenueId] = React.useState<number | undefined>(undefined)
  const [page, setPage] = React.useState<number>(1)
  const { data, isLoading } = useGetReviewsQuery({ page })

  const onEdit = (review: Review) => {
    setVenueId(review.venue)
    setReviewOpen(true)
  }

  React.useEffect(() => {
    dispatch(setTitle('Reviews'))
  }, [])

  return (
    <Container>
      <ReviewList data={data} isLoading={isLoading} onEdit={onEdit} />
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
    </Container>
  )
}
