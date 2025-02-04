import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { Box, Card, CircularProgress, Paper, Typography } from '@mui/material'
import { useAzureMaps } from 'react-azure-maps'
import Link from '../components/Link'
import LocationMarker from '../components/LocationMarker'
import Map from '../components/Map'
import StarBox from '../components/StarBox'
import VenueMarker from '../components/VenueMarker'
import { useGetVenuesQuery } from '../redux/apiSlice'
import { ListVenue } from '../redux/types'

export default function MapResultsView() {
  const { isMapReady } = useAzureMaps()
  const { data, isLoading } = useGetVenuesQuery({})
  const [locationLoading, setLocationLoading] = React.useState<boolean>(true)
  const [selectedVenue, setSelectedVenue] = React.useState<
    ListVenue | undefined
  >(undefined)

  const onMarkerClick = (newVenue: ListVenue) =>
    setSelectedVenue((oldVenue) =>
      newVenue.id === oldVenue?.id ? undefined : newVenue,
    )

  return (
    <Paper>
      <Box style={{ height: '300px' }}>
        <Map>
          <>
            <LocationMarker onReady={() => setLocationLoading(false)} />
            {data?.results.map((venue) => (
              <VenueMarker
                key={venue.id}
                venue={venue}
                onClick={onMarkerClick}
              />
            ))}
          </>
        </Map>
        {!isMapReady || isLoading || locationLoading ? (
          <CircularProgress />
        ) : null}
      </Box>
      {selectedVenue ? (
        <Card>
          <Typography component="h2" variant="h4">
            {selectedVenue.name}
          </Typography>
          <StarBox value={selectedVenue.score} />
          <Link to={selectedVenue.id.toString()}>View details</Link>
        </Card>
      ) : null}
    </Paper>
  )
}
