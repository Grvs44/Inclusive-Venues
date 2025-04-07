import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import type { Entity } from '../redux/types'

export default function ShareVenueButton({ venue }: { venue: Entity }) {
  const share = () =>
    toast.promise(
      navigator.clipboard.writeText(
        window.location.origin + '/venue/' + venue.id,
      ),
      {
        loading: 'Preparing to share...',
        success: 'Copied venue URL to clipboard',
        error: "Couldn't copy venue URL to clipboard",
      },
    )

  return (
    <Button onClick={() => share()} title="Share" aria-label="Share">
      <ShareIcon />
    </Button>
  )
}
