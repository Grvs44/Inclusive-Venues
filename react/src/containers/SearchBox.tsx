import React from 'react'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { Box, Button, InputAdornment, TextField } from '@mui/material'
import DropDown from '../components/DropDown'

const data: { id: number; name: string }[] = [
  { id: 1, name: 'filter1' },
  { id: 2, name: 'filter2' },
  { id: 3, name: 'filter3' },
  { id: 4, name: 'filter4' },
]

export default function SearchBox() {
  const getLocation = () =>{
    console.log('location')
  }

  return (
    <Box>
      <TextField
        name="location"
        label="Location"
        // Adapted from https://mui.com/material-ui/react-text-field/#icons
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" onClick={getLocation}>
                <LocationSearchingIcon />
              </InputAdornment>
            ),
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
    </Box>
  )
}
