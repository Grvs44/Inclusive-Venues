import React from 'react'
import { AzureMapHtmlMarker } from 'react-azure-maps'
import { ListVenue } from '../redux/types'

export type VenueMarkerProps = {
  venue: ListVenue
}

export default function VenueMarker({ venue }: VenueMarkerProps) {
  return (
    <AzureMapHtmlMarker
      options={{
        text: venue.rating?.toFixed(1),
        position: [venue.longitude, venue.latitude],
      }}
    />
  )
}
