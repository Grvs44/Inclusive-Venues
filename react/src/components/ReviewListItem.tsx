import React from 'react'
import { Button, ListItem, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
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
  const columns = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }
  return (
    <ListItem>
      <Grid
        container
        columnSpacing={{ xs: 2, md: 3 }}
        rowSpacing={0}
        columns={columns}
      >
        <Grid size={columns}>{`${review.venueName} (${review.date})`}</Grid>
        <Grid size={columns}>{review.body}</Grid>
        {review.ratings.map((rating) => (
          <Grid key={rating.category} size={4}>
            <Typography>{rating.category}</Typography>
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Grid>
        ))}
        <Grid size={columns}>
          <Button variant="outlined" onClick={() => onOpenVenue(review.venue)}>
            View venue
          </Button>
          <Button variant="outlined" onClick={() => onEdit(review)}>
            Edit review
          </Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}
