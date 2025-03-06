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
            <StarBox value={Number(venue.score)} sx={{ fontSize: 'inherit' }} />
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
    </LinkListItem>
  )
}
