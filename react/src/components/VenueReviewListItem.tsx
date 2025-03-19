import React from 'react'
import { Box, ListItem, ListItemText, Stack, Typography } from '@mui/material'
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
          <Box key={rating.category}>
            <Typography>{rating.category}: </Typography>
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Box>
        ))}
      </Stack>
    </ListItem>
  )
}
