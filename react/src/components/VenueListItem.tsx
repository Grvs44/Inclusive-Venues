import React from 'react'
import NavigationIcon from '@mui/icons-material/Navigation'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { ListVenue } from '../redux/types'
import LinkListItem from './LinkListItem'
import StarBox from './StarBox'

export type VenueListItemProps = {
  venue: ListVenue
}

export default function VenueListItem({ venue }: VenueListItemProps) {
  return (
    <LinkListItem to={`venue/${venue.id}`}>
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
    </LinkListItem>
  )
}
