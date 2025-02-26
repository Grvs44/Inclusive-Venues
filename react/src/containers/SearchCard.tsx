import React from 'react'
import { Button, Card, Stack, Typography } from '@mui/material'
import LocationInput from '../components/LocationInput'
import FilterArea from './FilterArea'

export default function SearchCard() {
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false)

  return (
    <Card>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography component="h3" variant="h4">
          Search
        </Typography>
        <LocationInput onLoadChange={setLocationLoading} />
        <FilterArea />
        <Button variant="contained" disabled={locationLoading}>
          Search
        </Button>
      </Stack>
    </Card>
  )
}
