import React from 'react'
import NavigationIcon from '@mui/icons-material/Navigation'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ListVenue } from '../redux/types'
import StarBox from './StarBox'

export type VenueListItemProps = {
  venue: ListVenue
}

export default function VenueListItem({ venue }: VenueListItemProps) {
  return (
    <ListItem>
      <ListItemText
        primary={
          <Stack direction="row" spacing={4}>
            {venue.name}
            <StarBox value={venue.score} sx={{ fontSize: 'inherit' }} />
          </Stack>
        }
        secondary={
          <>
            <NavigationIcon sx={{ fontSize: 'inherit' }} />
            {venue.latitude + 'km'}
          </>
        }
      />
    </ListItem>
  )
}
