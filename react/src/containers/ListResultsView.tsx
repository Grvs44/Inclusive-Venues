import React from 'react'
import List from '@mui/material/List'
import LoadingSkeleton from '../components/LoadingSkeleton'
import VenueListItem from '../components/VenueListItem'
import { ListVenue, PageState } from '../redux/types'

export type ResultsViewProps = {
  data?: PageState<ListVenue>
  isLoading: boolean
  onClick: (venueId: number) => void
}

export default function ListResultsView({
  data,
  isLoading,
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
      <LoadingSkeleton isLoading={isLoading} />
    </List>
  )
}
