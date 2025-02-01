import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { CircularProgress } from '@mui/material'
import { useAzureMaps } from 'react-azure-maps'
import LocationMarker from '../components/LocationMarker'
import Map from '../components/Map'
import VenueMarker from '../components/VenueMarker'
import { ListVenue } from '../redux/types'

export type MapResultsViewProps = {
  results?: ListVenue[]
}

export default function MapResultsView({ results }: MapResultsViewProps) {
  const { mapRef, isMapReady } = useAzureMaps()
  return (
    <div style={{ height: '300px' }}>
      <Map>
        <>
          <LocationMarker />
          {results?.map((venue) => (
            <VenueMarker key={venue.id} venue={venue} />
          ))}
        </>
      </Map>
      {isMapReady ? null : <CircularProgress />}
    </div>
  )
}
