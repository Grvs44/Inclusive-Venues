// Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
import React from 'react'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material'

export type LocationInputProps = {
  onLoadChange: (loading: boolean) => void
}

export default function LocationInput(props: LocationInputProps) {
  const [location, setLocation] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      props.onLoadChange(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLoading(false)
        props.onLoadChange(false)
        setLocation(`${coords.latitude},${coords.longitude}`)
      })
    }
  }
  return (
    <TextField
      name="location"
      label="Location"
      value={location}
      onChange={(event) => setLocation(event.currentTarget.value)}
      disabled={loading}
      // Adapted from https://mui.com/material-ui/react-text-field/#icons
      slotProps={{
        input: {
          endAdornment: navigator.geolocation ? (
            <InputAdornment position="end">
              <Button
                onClick={getLocation}
                disabled={loading}
                title="Get location"
              >
                {loading ? <CircularProgress /> : <LocationSearchingIcon />}
              </Button>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}
