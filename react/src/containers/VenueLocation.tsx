import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { Venue } from '../redux/types'

export default function VenueLocation({ venue }: { venue: Venue }) {
  const [map, setMap] = React.useState<boolean>(false)
  return (
    <Card>
      {map ? (
        <p>Map here</p>
      ) : (
        <Button onClick={() => setMap(true)}>Show map</Button>
      )}
      {venue.address ? <Typography>{venue.address}</Typography> : null}
      <Button variant="contained">
        Directions
        <OpenInNewIcon fontSize="inherit" />
      </Button>
    </Card>
  )
}
