import React from 'react'
import NavigationIcon from '@mui/icons-material/Navigation'
import { ListItem, ListItemButton, Typography } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import type { ListVenue } from '../redux/types'
import StarBox from './StarBox'

export type VenueListItemProps = {
  venue: ListVenue
  onClick?: () => void
}

export default function VenueListItem({ venue, onClick }: VenueListItemProps) {
  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={
            <Stack direction="row" spacing={4}>
              <Typography>{venue.name}</Typography>
              <StarBox
                value={Number(venue.score)}
                sx={{ fontSize: 'inherit' }}
              />
            </Stack>
          }
          secondary={
            venue.distance ? (
              <>
                <NavigationIcon sx={{ fontSize: 'inherit' }} />
                {venue.distance + 'km'}
              </>
            ) : null
          }
        />
      </ListItemButton>
    </ListItem>
  )
}
