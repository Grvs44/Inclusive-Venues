import React from 'react'
import {
  AzureDataPosition,
  AzureMapHtmlMarker,
  useAzureMaps,
} from 'react-azure-maps'

export default function LocationMarker() {
  const [position, setPosition] = React.useState<AzureDataPosition | undefined>(
    undefined,
  )
  const { mapRef } = useAzureMaps()

  React.useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const center = [coords.longitude, coords.latitude]
        setPosition(center)
        mapRef?.setCamera({ center, zoom: 12 })
      })
  }, [])

  return position ? (
    <AzureMapHtmlMarker options={{ text: 'You', position }} />
  ) : null
}
