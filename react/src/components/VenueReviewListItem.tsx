import React from 'react'
import { Box, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
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
      <Grid
        container
        columnSpacing={{ xs: 2, md: 3 }}
        rowSpacing={0}
        columns={{ xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }}
      >
        <Grid size={{ xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }}>
          {review.body}
        </Grid>
        {review.ratings.map((rating) => (
          <Grid key={rating.category} size={4} color="GrayText">
            <Typography>{rating.category}</Typography>
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Grid>
        ))}
      </Grid>
    </ListItem>
  )
}
