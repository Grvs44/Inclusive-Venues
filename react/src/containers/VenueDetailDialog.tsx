import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
} from '@mui/material'
import { useGetUserDetailsQuery, useGetVenueQuery } from '../redux/apiSlice'
import VenueImageList from './VenueImageList'
import VenueInfo from './VenueInfo'
import VenueLocation from './VenueLocation'
import VenueReviewArea from './VenueReviewArea'

export type VenueDetailDialogProps = {
  open: boolean
  onClose: () => void
  id?: string | number
  openReview: () => void
}

export default function VenueDetailDialog(props: VenueDetailDialogProps) {
  const { data, isFetching } = useGetVenueQuery(props.id, {
    skip: !props.open || props.id == undefined,
  })
  const user = useGetUserDetailsQuery()

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        {!isFetching && data ? data.name : <Skeleton sx={{ width: '10em' }} />}
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
        {isFetching || data == undefined ? (
          <CircularProgress />
        ) : (
          <>
            <VenueImageList images={data.images} />
            <VenueInfo venue={data} />
            <VenueReviewArea id={data.id}>
              {user.data ? (
                <Button onClick={props.openReview}>Leave a review</Button>
              ) : (
                <Button disabled>Sign in to leave a review</Button>
              )}
            </VenueReviewArea>
            <VenueLocation venue={data} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
