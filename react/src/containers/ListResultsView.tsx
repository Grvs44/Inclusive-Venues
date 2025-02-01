import React from 'react'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import VenueListItem from '../components/VenueListItem'
import { ListVenue } from '../redux/types'

export type ListResultsViewProps = {
  results?: ListVenue[]
}

export default function ListResultsView({ results }: ListResultsViewProps) {
  return (
    <List>
      {results?.map((venue) => <VenueListItem key={venue.id} venue={venue} />)}
      <Skeleton />
    </List>
  )
}
