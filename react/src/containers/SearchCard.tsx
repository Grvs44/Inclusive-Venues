import React from 'react'
import { Button, Card, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import LocationInput from '../components/LocationInput'
import { useFilters } from '../providers/FilterProvider'
import FilterArea from './FilterArea'

export default function SearchCard() {
  const filters = useFilters()
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false)

  if (filters == undefined) return <></>

  return (
    <Card>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography component="h3" variant="h4">
          Search
        </Typography>
        <LocationInput
          onLoadChange={setLocationLoading}
          location={filters.location || ''}
          setLocation={filters.setLocation}
        />
        <FilterArea />
        <Button
          variant="contained"
          disabled={locationLoading}
          LinkComponent={Link}
          to="/venue"
        >
          Search
        </Button>
      </Stack>
    </Card>
  )
}
