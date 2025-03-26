import React from 'react'
import List from '@mui/material/List'
import LoadingSkeleton from '../components/LoadingSkeleton'
import VenueListItem from '../components/VenueListItem'
import type { ResultsViewProps } from './ListResultsView'

export default function MyVenuesList({
  data,
  isFetching,
  onClick,
}: ResultsViewProps) {
  return (
    <List>
      {data?.results.map((venue) => (
        <VenueListItem
          key={venue.id}
          venue={venue}
          onClick={() => onClick(venue.id)}
        />
      ))}
      <LoadingSkeleton isFetching={isFetching} />
    </List>
  )
}
