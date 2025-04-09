import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import toast from 'react-hot-toast'
import CloseButton from '../components/CloseButton'
import DropDown from '../components/DropDown'
import ErrorBox from '../components/ErrorBox'
import RateBox from '../components/RateBox'
import {
  useCreateReviewMutation,
  useGetRatingCategoriesQuery,
  useGetVenueReviewQuery,
  useUpdateReviewMutation,
} from '../redux/apiSlice'
import type { ListRating, VenueCategory } from '../redux/types'
import { getErrorMessage } from '../redux/utils'

export type ReviewDialogProps = {
  venueId?: number
  open: boolean
  onClose: () => void
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function ReviewDialog(props: ReviewDialogProps) {
  const skip = !props.open || props.venueId == undefined
  const { data, error, isError, isFetching, refetch } = useGetVenueReviewQuery(
    props.venueId,
    { skip },
  )
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
      toast.error('You must rate at least one category to leave a review')
      return
    }
    if (ratings.filter((r) => r.value == 0).length) {
      toast.error('Please rate all the chosen categories')
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
      toast.error(getErrorMessage(result.error))
    } else {
      props.onClose()
      toast.success(
        data ? 'Review updated successfully' : 'Review created successfully',
      )
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
      <CloseButton onClick={props.onClose} />
      <DialogContent>
        {isFetching || categories.isFetching ? (
          <CircularProgress />
        ) : isError ? (
          <ErrorBox error={error} retry={refetch} />
        ) : (
          <>
            <Grid container size={12} sx={{ alignItems: 'center' }}>
              {ratings.map((rating) => (
                <React.Fragment key={rating.category}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <ListItemText
                      primary={
                        categories.data?.find(({ id }) => id == rating.category)
                          ?.name
                      }
                      secondary={
                        categories.data?.find((c) => c.id == rating.category)
                          ?.description
                      }
                      sx={{ whiteSpace: 'pre-wrap' }}
                    />
                  </Grid>
                  <Grid size={3} sx={{ minWidth: 'fit-content' }}>
                    <RateBox
                      value={rating.value}
                      onRate={onRatingChange(rating)}
                    />
                  </Grid>
                  <Grid size={1} sx={{ minWidth: 'fit-content' }}>
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
