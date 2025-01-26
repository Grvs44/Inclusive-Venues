import React from 'react'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import {
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DropDown from '../components/DropDown'

const data: { id: number; name: string }[] = [
  { id: 1, name: 'filter1' },
  { id: 2, name: 'filter2' },
  { id: 3, name: 'filter3' },
  { id: 4, name: 'filter4' },
]

export default function SearchBox() {
  const [location, setLocation] = React.useState<string>('')
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false)

  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLocationLoading(false)
        setLocation(`${coords.latitude},${coords.longitude}`)
      })
    }
  }

  return (
    <Card>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography component="h3" variant="h4">
          Search
        </Typography>
        <TextField
          name="location"
          label="Location"
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
          disabled={locationLoading}
          // Adapted from https://mui.com/material-ui/react-text-field/#icons
          slotProps={{
            input: {
              endAdornment: navigator.geolocation ? (
                <InputAdornment position="end">
                  <Button
                    onClick={getLocation}
                    disabled={locationLoading}
                    title="Get location"
                  >
                    {locationLoading ? (
                      <CircularProgress />
                    ) : (
                      <LocationSearchingIcon />
                    )}
                  </Button>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <DropDown
          label="Filters"
          data={data}
          isLoading={false}
          onChange={() => console.log('changed')}
          getLabel={(x) => x.name}
        />
        <Button variant="contained" disabled={locationLoading}>
          Search
        </Button>
      </Stack>
    </Card>
  )
}
