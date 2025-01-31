import React from 'react'
import {
  AzureDataPosition,
  AzureMapHtmlMarker,
  useAzureMaps,
} from 'react-azure-maps'

export default ({ position }: { position: AzureDataPosition }) => {
  const { mapRef } = useAzureMaps()

  React.useEffect(() => {
    mapRef?.setCamera({ center: position, zoom: 18 })
  }, [mapRef])

  return <AzureMapHtmlMarker options={{ position }} />
}
