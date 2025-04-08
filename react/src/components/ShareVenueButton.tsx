import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import type { Venue } from '../redux/types'

const share = (venue: Venue) => {
  const url = window.location.origin + '/venue/' + venue.id
  const data = { url }
  return navigator.canShare && navigator.canShare(data)
    ? toast.promise(navigator.share(data), {
        loading: 'Sharing...',
        success: 'Venue URL shared',
        error: (error: DOMException) => error.message,
      })
    : toast.promise(navigator.clipboard.writeText(url), {
        loading: 'Sharing...',
        success: 'Copied venue URL to clipboard',
        error: (error: DOMException) => error.message,
      })
}

export default function ShareVenueButton({ venue }: { venue: Venue }) {
  return (
    <Button onClick={() => share(venue)} title="Share" aria-label="Share">
      <ShareIcon />
    </Button>
  )
}
