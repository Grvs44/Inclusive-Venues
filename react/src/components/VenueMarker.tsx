import React from 'react'
import Typography from '@mui/material/Typography'
import { AzureMapHtmlMarker, AzureMapPopup } from 'react-azure-maps'
import { ListVenue } from '../redux/types'

export type VenueMarkerProps = {
  venue: ListVenue
}

export default function VenueMarker({ venue }: VenueMarkerProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const position = [venue.longitude, venue.latitude]

  return (
    <>
      <AzureMapHtmlMarker
        events={[{ eventName: 'click', callback: () => setOpen(true) }]}
        options={{
          text: venue.rating?.toFixed(1),
          position,
        }}
      />
      <AzureMapPopup
        isVisible={open}
        options={{ position }}
        events={[{ eventName: 'close', callback: () => setOpen(false) }]}
        popupContent={<Typography component="p">{venue.name}</Typography>}
      />
    </>
  )
}
