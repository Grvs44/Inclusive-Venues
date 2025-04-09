import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Skeleton from '@mui/material/Skeleton'
import CloseButton from '../components/CloseButton'
import ErrorBox from '../components/ErrorBox'
import { useGetUserDetailsQuery, useGetVenueQuery } from '../redux/apiSlice'
import AverageRatingsArea from './AverageRatingsArea'
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
  const { data, error, isError, isFetching, refetch } = useGetVenueQuery(
    props.id,
    { skip: !props.open || props.id == undefined },
  )
  const user = useGetUserDetailsQuery()

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        {!isFetching && data ? data.name : <Skeleton sx={{ width: '10em' }} />}
      </DialogTitle>
      <CloseButton onClick={props.onClose} />
      <DialogContent>
        {isFetching ? (
          <CircularProgress />
        ) : isError || data == undefined ? (
          <ErrorBox error={error} retry={refetch} />
        ) : (
          <>
            <VenueImageList images={data.images} />
            <VenueInfo venue={data} />
            <AverageRatingsArea id={data.id} />
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
