import React from 'react'
import {
  Button,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { Review } from '../redux/types'
import StarBox from './StarBox'

export type ReviewListItemProps = {
  review: Review
  onOpenVenue: (venueId: number) => void
  onEdit: (review: Review) => void
}

export default function ReviewListItem({
  review,
  onOpenVenue,
  onEdit,
}: ReviewListItemProps) {
  return (
    <ListItem>
      <ListItemText
        primary={review.venueName}
        secondary={
          <>
            {review.body}
            <Stack spacing={4} direction="row">
              {review.ratings.map((rating) => (
                <Typography key={rating.category}>
                  {rating.category}:{' '}
                  <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
                </Typography>
              ))}
            </Stack>
          </>
        }
      />
      <Button variant="contained" onClick={() => onOpenVenue(review.venue)}>
        View venue
      </Button>
      <Button variant="contained" onClick={() => onEdit(review)}>
        Edit review
      </Button>
    </ListItem>
  )
}
