import React from 'react'
import { Container } from '@mui/material'
import { useDispatch } from 'react-redux'
import ReviewList from '../containers/ReviewList'
import { setTitle } from '../redux/titleSlice'
import { ListReview } from '../redux/types'

// Test data
const results: ListReview[] = [
  {
    id: 1,
    venue: 1,
    body: 'my review',
    ratings: [
      { category: 1, value: 4 },
      { category: 2, value: 3 },
    ],
  },
]
const data = { results, count: 1, next: null }
const isLoading = false

export default function ReviewListPage() {
  const dispatch = useDispatch()

  const onEdit = (review: ListReview) => {
    console.log(review)
  }

  React.useEffect(() => {
    dispatch(setTitle('Reviews'))
  }, [])

  return (
    <Container>
      <ReviewList data={data} isLoading={isLoading} onEdit={onEdit} />
    </Container>
  )
}
