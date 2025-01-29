import React from 'react'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import VenueListItem from '../components/VenueListItem'
import { data } from './MapResultsView'

export default function ListResultsView() {
  return (
    <List>
      {data.map((venue) => (
        <VenueListItem key={venue.id} venue={venue} />
      ))}
      <Skeleton />
    </List>
  )
}
