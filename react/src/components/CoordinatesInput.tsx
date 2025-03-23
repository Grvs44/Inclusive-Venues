import React from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import LocationPicker from './LocationPicker'
import { getLocationErrorMessage } from './utils'

export default function CoordinatesInput() {
  const [latitude, setLatitude] = React.useState<string>('')
  const [longitude, setLongitude] = React.useState<string>('')
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
          alert(getLocationErrorMessage(error))
        },
      )
    } else {
      alert("Your browser doesn't support location services")
    }
  }

  const onLocationPicked = (latitude: number, longitude: number) => {
    setLatitude(latitude.toFixed(6))
    setLongitude(longitude.toFixed(6))
    setPickerOpen(false)
  }

  return (
    <fieldset>
      <legend>
        <Typography>Location</Typography>
      </legend>
      <Button onClick={getLocation} loading={loading} loadingPosition="start">
        Use current location
      </Button>
      <Button onClick={() => setPickerOpen(true)} disabled={loading}>
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
        />
        <TextField
          type="number"
          label="Longitude"
          name="longitude"
          value={longitude}
          onChange={(event) => setLongitude(event.target.value)}
          fullWidth
          required
        />
        <LocationPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          latitude={latitude}
          longitude={longitude}
          onSubmit={onLocationPicked}
        />
      </Stack>
    </fieldset>
  )
}
