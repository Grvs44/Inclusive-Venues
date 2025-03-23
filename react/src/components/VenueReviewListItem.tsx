import React from 'react'
import { ListItem, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import type { VenueReview } from '../redux/types'
import StarBox from './StarBox'

export type VenueReviewListItemProps = {
  review: VenueReview
}

export default function VenueReviewListItem({
  review,
}: VenueReviewListItemProps) {
  const columns = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }
  return (
    <ListItem>
      <Grid
        container
        columnSpacing={{ xs: 2, md: 3 }}
        rowSpacing={0}
        columns={columns}
      >
        <Grid size={columns}>
          <Typography>
            {review.author} - {review.date}
          </Typography>
        </Grid>
        <Grid size={columns}>{review.body}</Grid>
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
