import React from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import DropDown from '../components/DropDown'
import { ListCategory, ListRating, Venue } from '../redux/types'

export type ReviewDialogProps = {
  venueId?: number
  open: boolean
  onClose: () => void
}

// Test data
const data: Venue | undefined = undefined
const isLoading = false
const categoryList = {
  data: [
    { id: 1, name: 'category 1' },
    { id: 2, name: 'category 2' },
  ],
  isLoading: false,
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function ReviewDialog(props: ReviewDialogProps) {
  const [ratings, setRatings] = React.useState<ListRating[]>([])
  const addRating = (category: ListCategory | null) =>
    category
      ? setRatings((ratings) =>
          ratings.concat({ category: category.id, value: 0 }),
        )
      : null

  return (
    <Dialog open={props.open}>
      <DialogTitle>{data ? data.name : 'Loading review...'}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {ratings.map((rating) => (
              <p key={rating.id}>
                {rating.category}:{rating.value}
              </p>
            ))}
            <DropDown
              data={categoryList.data}
              isLoading={categoryList.isLoading}
              label="Add category"
              onChange={addRating}
              getLabel={(c) => c.name}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>
          Close
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
