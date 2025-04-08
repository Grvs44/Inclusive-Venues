import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { Venue } from '../redux/types'
import { openMaps } from '../redux/utils'

export default function VenueLocation({ venue }: { venue: Venue }) {
  const click = () => {
    toast.loading('Opening Map app...', { duration: 4000 })
    openMaps(venue)
  }

  return (
    <Card sx={{ width: '50%' }}>
      <Stack>
        {venue.map ? (
          <img
            src={venue.map}
            loading="lazy"
            alt="Map preview"
            title="Click to open in Maps"
            onClick={click}
            style={{ cursor: 'pointer' }}
          />
        ) : null}
        {venue.address ? <Typography>{venue.address}</Typography> : null}
        <Button variant="contained" onClick={click}>
          Open in Maps
          <OpenInNewIcon fontSize="inherit" />
        </Button>
      </Stack>
    </Card>
  )
}
