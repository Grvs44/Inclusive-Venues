import React from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import DropDown from '../components/DropDown'
import RateBox from '../components/RateBox'
import { useCreateReviewMutation } from '../redux/apiSlice'
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
    { id: 1, name: 'category 1', description: 'description1' },
    { id: 2, name: 'category 2', description: 'description2' },
  ],
  isLoading: false,
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function ReviewDialog(props: ReviewDialogProps) {
  const [createReview] = useCreateReviewMutation()
  const [ratings, setRatings] = React.useState<ListRating[]>([])
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const bodyRef = React.useRef<HTMLInputElement | null>(null)

  const addRating = (category: ListCategory | null) =>
    category && !ratings.find((r) => r.category == category.id)
      ? setRatings((ratings) =>
          ratings.concat({ category: category.id, value: 0 }),
        )
      : null

  const onRatingChange = (rating: ListRating) => (value: number) =>
    setRatings((ratings) => {
      const index = ratings.indexOf(rating)
      const newCategory = { ...rating, value }
      return index == -1
        ? ratings.concat(newCategory)
        : ratings
            .slice(0, index)
            .concat(newCategory)
            .concat(ratings.slice(index + 1))
    })

  const deleteRating = (category: number) =>
    setRatings((ratings) => ratings.filter((r) => r.category != category))

  const onSubmit = async () => {
    if (props.venueId == undefined) return
    console.log('submit')
    console.log(ratings)
    console.log(bodyRef.current?.value)
    setSubmitting(true)
    const result = createReview({
      venue: props.venueId,
      body: bodyRef.current?.value || '',
      ratings,
    })
    console.log(await result)
    setSubmitting(false)
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{data ? data.name : 'Loading review...'}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <List>
              {ratings.map((rating) => (
                <ListItem key={rating.category}>
                  <ListItemText
                    primary={rating.category}
                    secondary={
                      categoryList.data.find((c) => c.id == rating.category)
                        ?.description
                    }
                  />
                  <RateBox
                    value={rating.value}
                    onRate={onRatingChange(rating)}
                    onDelete={() => deleteRating(rating.category)}
                  />
                </ListItem>
              ))}
            </List>
            <DropDown
              data={categoryList.data}
              isLoading={categoryList.isLoading}
              label="Add category"
              onChange={addRating}
              getLabel={(c) => c.name}
            />
            <TextField inputRef={bodyRef} label="Review body" fullWidth />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>
          Close
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || submitting}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
