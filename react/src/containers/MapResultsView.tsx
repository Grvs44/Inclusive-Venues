import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { CircularProgress } from '@mui/material'
import { useAzureMaps } from 'react-azure-maps'
import LocationMarker from '../components/LocationMarker'
import Map from '../components/Map'
import VenueMarker from '../components/VenueMarker'
import { useGetVenuesQuery } from '../redux/apiSlice'

export default function MapResultsView() {
  const { mapRef, isMapReady } = useAzureMaps()
  const { data, isLoading } = useGetVenuesQuery({})

  return (
    <div style={{ height: '300px' }}>
      <Map>
        <>
          <LocationMarker />
          {data?.results.map((venue) => (
            <VenueMarker key={venue.id} venue={venue} />
          ))}
        </>
      </Map>
      {isMapReady || isLoading ? null : <CircularProgress />}
    </div>
  )
}
