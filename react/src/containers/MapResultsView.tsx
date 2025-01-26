import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { AzureMap, AzureMapsProvider } from 'react-azure-maps'
import mapOptions from '../config/mapOptions'

export default function MapResultsView() {
  return (
    <div style={{ height: '300px' }}>
      <AzureMapsProvider>
        <AzureMap options={mapOptions}></AzureMap>
      </AzureMapsProvider>
    </div>
  )
}
