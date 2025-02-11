import React from 'react'
import List from '@mui/material/List'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ReviewListItem from '../components/ReviewListItem'
import { ListReview, PageState } from '../redux/types'

export type ReviewListProps = {
  data?: PageState<ListReview>
  isLoading: boolean
  onEdit: (review: ListReview) => void
}

export default function ReviewList({
  data,
  isLoading,
  onEdit,
}: ReviewListProps) {
  return (
    <List>
      {data?.results.map((review) => (
        <ReviewListItem key={review.id} review={review} onEdit={onEdit} />
      ))}
      <LoadingSkeleton isLoading={isLoading} />
    </List>
  )
}
