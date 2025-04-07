import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import type { Venue } from '../redux/types'

const share = async (venue: Venue) => {
  const url = window.location.origin + '/venue/' + venue.id
  if (navigator.share) {
    return toast.promise(navigator.share({ url }), {
      loading: 'Sharing...',
      success: 'Venue URL shared',
      error: "Couldn't share venue URL",
    })
  }
  return toast.promise(navigator.clipboard.writeText(url), {
    loading: 'Sharing...',
    success: 'Copied venue URL to clipboard',
    error: "Couldn't copy venue URL to clipboard",
  })
}

export default function ShareVenueButton({ venue }: { venue: Venue }) {
  return (
    <Button onClick={() => share(venue)} title="Share" aria-label="Share">
      <ShareIcon />
    </Button>
  )
}
