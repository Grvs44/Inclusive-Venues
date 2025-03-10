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
  location: string
  setLocation: (location: string) => void
}

export default function LocationInput(props: LocationInputProps) {
  const [loading, setLoading] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      props.onLoadChange(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLoading(false)
        props.onLoadChange(false)
        props.setLocation(
          `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`,
        )
      })
    }
  }
  return (
    <TextField
      name="location"
      label="Location"
      value={props.location}
      onChange={(event) => props.setLocation(event.currentTarget.value)}
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
