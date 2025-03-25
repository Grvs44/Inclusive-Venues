// Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
import React from 'react'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material'
import { getLocationErrorMessage } from './utils'

// Adapted from https://stackoverflow.com/a/3518546
const coordinatesPattern = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/

const postcodePattern = /^[A-Z][A-Z][0-9][0-9]?[ ]?[0-9][A-Z][A-Z]$/

export type LocationInputProps = {
  onLoadChange?: (loading: boolean) => void
  location: string
  setLocation: (location: string) => void
}

export default function LocationInput(props: LocationInputProps) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>(props.location)
  const [error, setError] = React.useState<boolean>(false)

  React.useEffect(() => setValue(props.location), [props.location])

  React.useEffect(() => {
    if (
      coordinatesPattern.test(value) ||
      postcodePattern.test(value.toUpperCase())
    ) {
      props.setLocation(value)
      setError(false)
    } else {
      setError(true)
    }
  }, [value])

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      if (props.onLoadChange) props.onLoadChange!!(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLoading(false)
          if (props.onLoadChange) props.onLoadChange(false)
          props.setLocation(
            `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`,
          )
        },
        (error) => {
          setLoading(false)
          if (props.onLoadChange) props.onLoadChange(false)
          alert(getLocationErrorMessage(error))
        },
      )
    } else {
      alert("Your browser doesn't support location services")
    }
  }
  return (
    <TextField
      name="location"
      label="Location"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      disabled={loading}
      color={error ? 'error' : 'primary'}
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
