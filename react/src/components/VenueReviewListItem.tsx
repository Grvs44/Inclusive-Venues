import React from 'react'
import { ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { Review } from '../redux/types'
import StarBox from './StarBox'

export type VenueReviewListItemProps = {
  review: Review
}

export default function VenueReviewListItem({
  review,
}: VenueReviewListItemProps) {
  return (
    <ListItem>
      <ListItemText primary={review.body} />
      <Stack spacing={4} direction="row">
        {review.ratings.map((rating) => (
          <Typography key={rating.category}>
            {rating.category}:{' '}
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Typography>
        ))}
      </Stack>
    </ListItem>
  )
}
