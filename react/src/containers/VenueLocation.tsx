import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { AzureMapsProvider } from 'react-azure-maps'
import Map from '../components/Map'
import PreviewMarker from '../components/PreviewMarker'
import { Venue } from '../redux/types'
import { openMaps } from '../redux/utils'

export default function VenueLocation({ venue }: { venue: Venue }) {
  const [map, setMap] = React.useState<boolean>(false)
  return (
    <Card>
      {map ? (
        <AzureMapsProvider>
          <Box sx={{ height: 300 }}>
            <Map>
              <PreviewMarker position={[venue.longitude, venue.latitude]} />
            </Map>
          </Box>
        </AzureMapsProvider>
      ) : (
        <Button onClick={() => setMap(true)}>Show map</Button>
      )}
      {venue.address ? <Typography>{venue.address}</Typography> : null}
      <Button variant="contained" onClick={() => openMaps(venue)}>
        Open in Maps
        <OpenInNewIcon fontSize="inherit" />
      </Button>
    </Card>
  )
}
