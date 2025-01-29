import React from 'react'
import NavigationIcon from '@mui/icons-material/Navigation'
import ListItem from '@mui/material/ListItem'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { ListVenue } from '../redux/types'
import StarBox from './StarBox'

export type VenueListItemProps = {
  venue?: ListVenue
}

export default function VenueListItem({ venue }: VenueListItemProps) {
  console.log(venue)
  return (
    <ListItem>
      <Typography>{venue ? venue.name : <Skeleton />}</Typography>
      <StarBox value={venue?.score} />
      <Typography>
        <NavigationIcon />
        {venue ? venue.latitude + 'km' : <Skeleton />}
      </Typography>
    </ListItem>
  )
}
