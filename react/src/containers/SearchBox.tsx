import React from 'react'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import {
  Button,
  Card,
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
  const getLocation = () => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(({ coords }) =>
        setLocation(`${coords.latitude},${coords.longitude}`),
      )
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
          // Adapted from https://mui.com/material-ui/react-text-field/#icons
          slotProps={{
            input: {
              endAdornment: navigator.geolocation ? (
                <InputAdornment position="end" onClick={getLocation}>
                  <LocationSearchingIcon />
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
        <Button variant="contained">Search</Button>
      </Stack>
    </Card>
  )
}
