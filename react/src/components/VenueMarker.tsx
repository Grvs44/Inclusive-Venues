import React from 'react'
import { AzureMapHtmlMarker } from 'react-azure-maps'
import { ListVenue } from '../redux/types'
import { PopupState } from './MapPopup'

export type VenueMarkerProps = {
  venue: ListVenue
  setPopup: (state: PopupState) => void
}

export default function VenueMarker({ venue, setPopup }: VenueMarkerProps) {
  const position = [venue.longitude, venue.latitude]
  const onClick = () => {
    console.log('Clicked')
  }
  return (
    <AzureMapHtmlMarker
      events={[
        { eventName: 'click', callback: onClick },
        {
          eventName: 'mouseenter',
          callback: () => setPopup({ position, venue }),
        },
        { eventName: 'mouseleave', callback: () => setPopup(undefined) },
      ]}
      options={{
        text: venue.rating?.toFixed(1),
        position,
      }}
    />
  )
}
