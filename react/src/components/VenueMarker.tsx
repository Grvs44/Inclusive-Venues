import React from 'react'
import { AzureMapHtmlMarker } from 'react-azure-maps'
import { MapTooltipContext } from '../providers/MapTooltipProvider'
import { ListVenue } from '../redux/types'

export type VenueMarkerProps = {
  venue: ListVenue
}

export default function VenueMarker({ venue }: VenueMarkerProps) {
  const { setText, clearText } = React.useContext(MapTooltipContext)
  return (
    <AzureMapHtmlMarker
      events={[
        {
          eventName: 'mouseenter',
          callback: () => (setText ? setText(venue.name) : null),
        },
        {
          eventName: 'mouseleave',
          callback: () => (clearText ? clearText() : null),
        },
      ]}
      options={{
        position: [venue.longitude, venue.latitude],
        text: venue.rating?.toFixed(1),
      }}
    />
  )
}
