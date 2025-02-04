import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Venue } from '../redux/types'
import { openMaps } from '../redux/utils'

export default function VenueLocation({ venue }: { venue: Venue }) {
  return (
    <Card sx={{ width: '50%' }}>
      <Stack>
        {venue.map ? (
          <img src={venue.map} loading="lazy" alt="Map preview" />
        ) : null}
        {venue.address ? <Typography>{venue.address}</Typography> : null}
        <Button variant="contained" onClick={() => openMaps(venue)}>
          Open in Maps
          <OpenInNewIcon fontSize="inherit" />
        </Button>
      </Stack>
    </Card>
  )
}
