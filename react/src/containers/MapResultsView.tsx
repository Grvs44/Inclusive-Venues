import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { CircularProgress } from '@mui/material'
import { AzureMap, useAzureMaps } from 'react-azure-maps'
import LocationMarker from '../components/LocationMarker'
import mapOptions from '../config/mapOptions'

export default function MapResultsView() {
  const { mapRef, isMapReady } = useAzureMaps()
  return (
    <div style={{ height: '300px' }}>
      <AzureMap
        options={mapOptions}
        styleOptions={{ showLogo: false, showFeedbackLink: false }}
      >
        <LocationMarker />
      </AzureMap>
      {isMapReady ? null : <CircularProgress />}
    </div>
  )
}
