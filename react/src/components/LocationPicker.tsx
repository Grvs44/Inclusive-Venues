import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { AzureMapHtmlMarker, useAzureMaps } from 'react-azure-maps'
import Map from './Map'

export type LocationPickerProps = {
  open: boolean
  onClose: () => void
  onSubmit: (latitude: number, longitude: number) => void
  latitude?: string | number
  longitude?: string | number
}

export default function LocationPicker(props: LocationPickerProps) {
  const { isMapReady } = useAzureMaps()
  const [latitude, setLatitude] = React.useState<number>(
    import.meta.env.VITE_DEFAULT_LATITUDE,
  )
  const [longitude, setLongitude] = React.useState<number>(
    import.meta.env.VITE_DEFAULT_LONGITUDE,
  )

  React.useEffect(() => {
    if (!open) return

    const latitude = props.latitude == '' ? NaN : Number(props.latitude)
    if (!isNaN(latitude)) setLatitude(latitude)

    const longitude = props.longitude == '' ? NaN : Number(props.longitude)
    if (!isNaN(longitude)) setLongitude(longitude)
  }, [props.open, props.latitude, props.longitude])

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Choose location</DialogTitle>
      <DialogContent>
        <Typography>Move the marker on the map to choose a location</Typography>
        <Box sx={{ height: 200 }}>
          <Map>
            <AzureMapHtmlMarker
              options={{ position: [longitude, latitude], draggable: true }}
              events={[
                {
                  eventName: 'dragend',
                  callback(e) {
                    const position = e.target?.getOptions().position
                    if (position) {
                      setLongitude(position[0])
                      setLatitude(position[1])
                    }
                  },
                },
              ]}
            />
          </Map>
        </Box>
        <Typography>
          {latitude},{longitude}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <Button
          onClick={() => props.onSubmit(latitude, longitude)}
          loading={!isMapReady}
          loadingPosition="start"
        >
          Choose
        </Button>
      </DialogActions>
    </Dialog>
  )
}
