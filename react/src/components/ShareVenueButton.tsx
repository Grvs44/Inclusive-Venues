import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import IconButton from '@mui/material/IconButton'
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

const ShareVenueButton: React.FC<{ venue: Venue }> = ({ venue }) => (
  <IconButton
    onClick={() => share(venue)}
    title="Share"
    aria-label="Share"
    color="primary"
  >
    <ShareIcon />
  </IconButton>
)

export default ShareVenueButton
