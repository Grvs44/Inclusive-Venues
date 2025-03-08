import React from 'react'
import { Button, Stack, TextField } from '@mui/material'

export default function CoordinatesInput() {
  const [latitude, setLatitude] = React.useState<string | null>(null)
  const [longitude, setLongitude] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude.toString())
          setLongitude(coords.longitude.toString())
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
      <Button onClick={getLocation} loading={loading} loadingPosition="start">
        Use current location
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
      </Stack>
    </fieldset>
  )
}
