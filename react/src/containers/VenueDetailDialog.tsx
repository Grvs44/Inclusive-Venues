import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetUserDetailsQuery, useGetVenueQuery } from '../redux/apiSlice'
import theme from '../theme'
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
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { data, isLoading } = useGetVenueQuery(props.id, {
    skip: !props.open || props.id == undefined,
  })
  const user = useGetUserDetailsQuery()

  return (
    <Dialog fullScreen={fullScreen} open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <Button onClick={props.onClose}>
          {fullScreen ? <ArrowBackIcon /> : <CloseIcon />}
        </Button>
        {data ? data.name : <Skeleton />}
      </DialogTitle>
      <DialogContent>
        {isLoading || data == undefined ? (
          <CircularProgress />
        ) : (
          <>
            <VenueImageList images={data.images} />
            <VenueInfo venue={data} />
            {user.data ? (
              <Button onClick={props.openReview}>Leave a review</Button>
            ) : (
              <Button disabled>Sign in to leave a review</Button>
            )}
            <VenueReviewArea id={data.id} />
            <VenueLocation venue={data} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
