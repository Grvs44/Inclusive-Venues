import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useDispatch } from 'react-redux'
import ReviewList from '../containers/ReviewList'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { ListReview } from '../redux/types'

export default function ReviewListPage() {
  const dispatch = useDispatch()
  const [page, setPage] = React.useState<number>(1)
  const { data, isLoading } = useGetReviewsQuery({ page })

  const onEdit = (review: ListReview) => {
    console.log(review)
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
    </Container>
  )
}
