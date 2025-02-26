import React from 'react'
import {
  Button,
  Card,
  Stack,
  Typography,
} from '@mui/material'
import DropDown from '../components/DropDown'
import LocationInput from '../components/LocationInput'
import SubcategoryFilterList from '../components/SubcategoryFilterList'

const data: { id: number; name: string }[] = [
  { id: 1, name: 'filter1' },
  { id: 2, name: 'filter2' },
  { id: 3, name: 'filter3' },
  { id: 4, name: 'filter4' },
]

export default function SearchCard() {
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false)

  return (
    <Card>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography component="h3" variant="h4">
          Search
        </Typography>
        <LocationInput onLoadChange={setLocationLoading} />
        <SubcategoryFilterList id={1} open/>
        <Button variant="contained" disabled={locationLoading}>
          Search
        </Button>
      </Stack>
    </Card>
  )
}
