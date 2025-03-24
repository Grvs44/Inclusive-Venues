import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import DropDown from '../components/DropDown'
import RatingInput from '../components/RatingInput'
import {
  useCreateReviewMutation,
  useGetRatingCategoriesQuery,
  useGetVenueReviewQuery,
  useUpdateReviewMutation,
} from '../redux/apiSlice'
import type { ListRating, VenueCategory } from '../redux/types'

export type ReviewDialogProps = {
  venueId?: number
  open: boolean
  onClose: () => void
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function ReviewDialog(props: ReviewDialogProps) {
  const skip = !props.open || props.venueId == undefined
  const { data, isFetching } = useGetVenueReviewQuery(props.venueId, {
    skip,
  })
  const categories = useGetRatingCategoriesQuery(undefined, {
    skip,
  })
  const [createReview] = useCreateReviewMutation()
  const [updateReview] = useUpdateReviewMutation()
  const [ratings, setRatings] = React.useState<ListRating[]>([])
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [body, setBody] = React.useState<string>('')

  React.useEffect(() => {
    if (data) {
      setBody(data.body)
      setRatings(data.ratings)
    } else {
      setRatings([])
      setBody('')
    }
  }, [data])

  const addRating = (category: VenueCategory | null) => {
    if (category && !ratings.find((r) => r.category == category.id)) {
      setRatings((ratings) =>
        ratings.concat({ category: category.id, value: 0 }),
      )
    }
    setSelectedCategory(null)
  }

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
    console.log(body)
    if (ratings.length == 0) {
      alert('You must rate at least one category to leave a review')
      return
    }
    if (ratings.filter((r) => r.value == 0).length) {
      alert('Please rate all the chosen categories')
      return
    }
    setSubmitting(true)
    const result = await (data
      ? updateReview({
          id: data.id,
          body,
          ratings,
        })
      : createReview({
          venue: props.venueId,
          body,
          ratings,
        }))
    if (result.error) {
      alert(
        'data' in result.error && Array.isArray(result.error.data)
          ? result.error.data
          : 'Unknown error',
      )
    } else {
      props.onClose()
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        {isFetching ? (
          <Skeleton sx={{ width: '10em' }} />
        ) : data ? (
          data.venueName
        ) : (
          'New review'
        )}
      </DialogTitle>
      <IconButton
        // Adapted from https://mui.com/material-ui/react-dialog/#customization
        aria-label="close"
        onClick={props.onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {isFetching || categories.isFetching ? (
          <CircularProgress />
        ) : (
          <>
            <Grid
              container
              spacing={2}
              sx={{ overflowX: 'hidden', alignItems: 'center' }}
            >
              {ratings.map((rating) => {
                const category = categories.data?.find(
                  (c) => c.id == rating.category,
                )
                return category ? (
                  <RatingInput
                    key={rating.category}
                    rating={rating}
                    category={category}
                    onRatingChange={() => onRatingChange(rating)}
                    deleteRating={() => deleteRating(rating.category)}
                  />
                ) : null
              })}
            </Grid>
            <DropDown
              data={categories.data || []}
              isFetching={categories.isFetching}
              label="Add category"
              onChange={addRating}
              getLabel={(c) => c.name}
              disabled={categories.data == undefined}
              value={selectedCategory}
            />
            <TextField
              value={body}
              onChange={(event) => setBody(event.target.value)}
              label="Review body"
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose} disabled={submitting}>
          Close
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isFetching || submitting}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
