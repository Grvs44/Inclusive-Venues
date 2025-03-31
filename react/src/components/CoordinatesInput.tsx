import React from 'react'
import { Box, Button, Stack, TextField } from '@mui/material'
import toast from 'react-hot-toast'
import LocationPicker from './LocationPicker'
import { getLocationErrorMessage } from './utils'

export type CoordinatesInputProps = {
  latitude: string
  longitude: string
  setLatitude: (latitude: string) => void
  setLongitude: (longitude: string) => void
  disabled?: boolean
}

export default function CoordinatesInput({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  disabled,
}: CoordinatesInputProps) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [pickerOpen, setPickerOpen] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude.toFixed(6))
          setLongitude(coords.longitude.toFixed(6))
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          toast.error(getLocationErrorMessage(error))
        },
      )
    } else {
      toast.error("Your browser doesn't support location services")
    }
  }

  const onLocationPicked = (latitude: number, longitude: number) => {
    setLatitude(latitude.toFixed(6))
    setLongitude(longitude.toFixed(6))
    setPickerOpen(false)
  }

  return (
    <Box>
      <Button
        onClick={getLocation}
        loading={loading}
        loadingPosition="start"
        disabled={disabled}
      >
        Use current location
      </Button>
      <Button
        onClick={() => setPickerOpen(true)}
        disabled={loading || disabled}
      >
        Choose location on map
      </Button>
      <Stack direction="row">
        <TextField
          type="number"
          label="Latitude"
          name="latitude"
          value={latitude}
          onChange={(event) => setLatitude(event.target.value)}
          fullWidth
          required
          disabled={disabled}
        />
        <TextField
          type="number"
          label="Longitude"
          name="longitude"
          value={longitude}
          onChange={(event) => setLongitude(event.target.value)}
          fullWidth
          required
          disabled={disabled}
        />
        <LocationPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          latitude={latitude}
          longitude={longitude}
          onSubmit={onLocationPicked}
        />
      </Stack>
    </Box>
  )
}
