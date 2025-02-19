import React from 'react'
import {
  Button,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { Review } from '../redux/types'
import Link from './Link'
import StarBox from './StarBox'

export type ReviewListItemProps = {
  review: Review
  onEdit: (review: Review) => void
}

export default function ReviewListItem({
  review,
  onEdit,
}: ReviewListItemProps) {
  return (
    <ListItem>
      <ListItemText
        primary={<Link to={`/venue/${review.venue}`}>{review.venueName}</Link>}
        secondary={review.body}
      />
      <Stack spacing={4}>
        {review.ratings.map((rating) => (
          <Typography key={rating.category}>
            {rating.category}:{' '}
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Typography>
        ))}
      </Stack>
      <Button variant="contained" onClick={() => onEdit(review)}>
        Edit
      </Button>
    </ListItem>
  )
}
