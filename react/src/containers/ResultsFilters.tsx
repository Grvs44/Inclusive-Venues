import React from 'react'
import Box from '@mui/material/Box'
import LocationInput from '../components/LocationInput'
import RadiusInput from '../components/RadiusInput'
import SwitchViewButton from '../components/SwitchViewButton'
import { useFilters } from '../providers/FilterProvider'
import FilterArea from './FilterArea'

export default function ResultsFilters() {
  const filters = useFilters()
  
  if (filters == undefined) return <></>

  return (
    <Box>
      <LocationInput
        onLoadChange={() => {}}
        location={filters.location}
        setLocation={filters.setLocation}
      />
      <RadiusInput radius={filters.radius} setRadius={filters.setRadius} />
      <FilterArea />
      <SwitchViewButton />
    </Box>
  )
}
