import React from 'react'
import { Button, Card, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import LocationInput from '../components/LocationInput'
import RadiusInput from '../components/RadiusInput'
import { useFilters } from '../providers/FilterProvider'
import FilterArea from './FilterArea'

export default function SearchCard() {
  const filters = useFilters()
  const navigate = useNavigate()
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false)

  if (filters == undefined) return <></>

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    navigate('/venue')
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <Stack sx={{ alignItems: 'center' }} spacing={2}>
          <Typography component="h3" variant="h4">
            Search
          </Typography>
          <LocationInput
            onLoadChange={setLocationLoading}
            location={filters.location}
            setLocation={filters.setLocation}
          />
          <RadiusInput radius={filters.radius} setRadius={filters.setRadius} />
          <FilterArea />
          <Button variant="contained" type="submit" disabled={locationLoading}>
            Search
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
