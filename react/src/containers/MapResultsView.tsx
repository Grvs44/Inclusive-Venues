import React from 'react'
import 'azure-maps-control/dist/atlas.min.css'
import { CircularProgress } from '@mui/material'
import { AzureMap, useAzureMaps } from 'react-azure-maps'
import LocationMarker from '../components/LocationMarker'
import MapPopup, { PopupState } from '../components/MapPopup'
import VenueMarker from '../components/VenueMarker'
import mapOptions from '../config/mapOptions'
import { ListVenue } from '../redux/types'

// Test data
const data: ListVenue[] = [
  {
    id: 1,
    name: 'The Hobbit',
    latitude: 50.918812,
    longitude: -1.395331,
  },
  {
    id: 2,
    name: 'Jesters',
    latitude: 50.918276,
    longitude: -1.395412,
    rating: 3,
  },
  {
    id: 3,
    name: 'Building 32',
    latitude: 50.936716,
    longitude: -1.395974,
    rating: 5,
  },
  {
    id: 4,
    name: 'Building 16',
    latitude: 50.937632,
    longitude: -1.395651,
    rating: 4,
  },
  {
    id: 5,
    name: 'Building 46',
    latitude: 50.934672,
    longitude: -1.399775,
  },
  {
    id: 6,
    name: "The Stag's",
    latitude: 50.934629,
    longitude: -1.397236,
  },
]

export default function MapResultsView() {
  const { mapRef, isMapReady } = useAzureMaps()
  const [popup, setPopup] = React.useState<PopupState>(undefined)
  return (
    <div style={{ height: '300px' }}>
      <AzureMap
        options={mapOptions}
        styleOptions={{ showLogo: false, showFeedbackLink: false }}
      >
        <>
          <LocationMarker />
          {data.map((venue) => (
            <VenueMarker key={venue.id} venue={venue} setPopup={setPopup} />
          ))}
          <MapPopup state={popup} />
        </>
      </AzureMap>
      {isMapReady ? null : <CircularProgress />}
    </div>
  )
}
