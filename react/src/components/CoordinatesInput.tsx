import React from 'react'
import {
  Button,
  Stack,
  TextField,
} from '@mui/material'

export default function CoordinatesInput() {
  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude)
          setLongitude(coords.longitude)
          setLoading(false)
        },
        (error) => {
          alert("Couldn't retrieve location: " + error.message)
          setLoading(false)
        },
      )
    } else {
      alert('Geolocation not supported by browser')
    }
  }

  return (
    <fieldset>
      <legend>Location</legend>
      <Button onClick={getLocation} loading={loading}>Use current location</Button>
      <Stack direction="row">
        <TextField
          type="number"
          label="latitude"
          name="Latitude"
          value={latitude}
          fullWidth
          required
        />
        <TextField
          type="number"
          label="longitude"
          name="Longitude"
          value={longitude}
          fullWidth
          required
        />
      </Stack>
    </fieldset>
  )
}
