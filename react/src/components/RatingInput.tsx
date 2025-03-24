import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import ListItemText from '@mui/material/ListItemText'
import { ListRating, RatingCategory } from '../redux/types'
import RateBox from './RateBox'

export type RatingInputProps = {
  rating: ListRating
  category: RatingCategory
  onRatingChange: (value: number) => void
  deleteRating: () => void
}

export default function RatingInput(props: RatingInputProps) {
  return (
    <>
      <Grid size={7}>
        <ListItemText
          primary={props.category.name}
          secondary={props.category.description}
        />
      </Grid>
      <Grid size={3}>
        <RateBox value={props.rating.value} onRate={props.onRatingChange} />
      </Grid>
      <Grid size={1}>
        <Button
          onClick={() => props.deleteRating()}
          aria-label="Remove rating"
          title="Remove rating"
          color="error"
        >
          <DeleteOutlineOutlinedIcon />
        </Button>
      </Grid>
    </>
  )
}
