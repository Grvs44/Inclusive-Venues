import React from 'react'
import { Typography } from '@mui/material'
import List from '@mui/material/List'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ReviewListItem from '../components/ReviewListItem'
import { PageState, Review } from '../redux/types'

export type ReviewListProps = {
  data?: PageState<Review>
  isFetching: boolean
  onOpenVenue: (venueId: number) => void
  onEdit: (review: Review) => void
}

export default function ReviewList({
  data,
  isFetching,
  onOpenVenue,
  onEdit,
}: ReviewListProps) {
  return data?.results.length || isFetching ? (
    <List>
      {data?.results.map((review) => (
        <ReviewListItem
          key={review.id}
          review={review}
          onOpenVenue={onOpenVenue}
          onEdit={onEdit}
        />
      ))}
      <LoadingSkeleton isFetching={isFetching} />
    </List>
  ) : (
    <Typography>
      You haven't left any reviews yet. When you do, they'll appear here.
    </Typography>
  )
}
