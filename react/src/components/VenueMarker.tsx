import React from 'react'
import { AzureMapHtmlMarker } from 'react-azure-maps'
import { ListVenue } from '../redux/types'

export type VenueMarkerProps = {
  venue: ListVenue
  onClick: (venue: ListVenue) => void
}

export default function VenueMarker({ venue, onClick }: VenueMarkerProps) {
  return (
    <AzureMapHtmlMarker
      events={[{ eventName: 'click', callback: () => onClick(venue) }]}
      options={{
        text: venue.score?.toFixed(1),
        position: [venue.longitude, venue.latitude],
      }}
    />
  )
}
