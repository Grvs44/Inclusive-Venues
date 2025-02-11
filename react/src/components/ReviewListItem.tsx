import React from 'react'
import { ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { ListReview } from '../redux/types'
import StarBox from './StarBox'

export type ReviewListItemProps = {
  review: ListReview
  onEdit: (review: ListReview) => void
}

export default function ReviewListItem(props: ReviewListItemProps) {
  return (
    <ListItem>
      <ListItemText
        primary={
          <Stack spacing={4}>
            {props.review.venue}
            {props.review.ratings.map((rating) => (
              <Typography>
                {rating.category}:{' '}
                <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
              </Typography>
            ))}
          </Stack>
        }
        secondary={<Typography>{props.review.body}</Typography>}
      />
    </ListItem>
  )
}
