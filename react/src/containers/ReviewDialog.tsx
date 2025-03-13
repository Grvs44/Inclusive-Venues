import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import DropDown from '../components/DropDown'
import RateBox from '../components/RateBox'
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
  const { data, isLoading } = useGetVenueReviewQuery(props.venueId, {
    skip: !props.open || props.venueId == undefined,
  })
  const categories = useGetRatingCategoriesQuery(undefined, {
    skip: data == undefined,
  })
  const [createReview] = useCreateReviewMutation()
  const [updateReview] = useUpdateReviewMutation()
  const [ratings, setRatings] = React.useState<ListRating[]>([])
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const bodyRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (data) {
      if (bodyRef.current) bodyRef.current.value = data.body
      setRatings(data.ratings)
    }
  }, [data])

  const addRating = (category: VenueCategory | null) =>
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
          body: bodyRef.current?.value || '',
          ratings,
        })
      : createReview({
          venue: props.venueId,
          body: bodyRef.current?.value || '',
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
      <DialogTitle>{data ? data.venueName : 'New review'}</DialogTitle>
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
        {isLoading || categories.isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid
              container
              spacing={2}
              sx={{ overflowX: 'hidden', alignItems: 'center' }}
            >
              {ratings.map((rating) => (
                <React.Fragment key={rating.category}>
                  <Grid size={7}>
                    <ListItemText
                      primary={
                        categories.data?.find(({ id }) => id == rating.category)
                          ?.name
                      }
                      secondary={
                        categories.data?.find((c) => c.id == rating.category)
                          ?.description
                      }
                    />
                  </Grid>
                  <Grid size={3}>
                    <RateBox
                      value={rating.value}
                      onRate={onRatingChange(rating)}
                    />
                  </Grid>
                  <Grid size={1}>
                    <Button
                      onClick={() => deleteRating(rating.category)}
                      aria-label="Remove rating"
                      title="Remove rating"
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <DropDown
              data={categories.data || []}
              isLoading={categories.isLoading}
              label="Add category"
              onChange={addRating}
              getLabel={(c) => c.name}
              disabled={categories.data == undefined}
            />
            <TextField inputRef={bodyRef} label="Review body" fullWidth />
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
          disabled={isLoading || submitting}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
