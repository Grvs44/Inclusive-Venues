import React from 'react'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import VenueListItem from '../components/VenueListItem'
import { ListVenue, PageState } from '../redux/types'

export type ResultsViewProps = {
  data?: PageState<ListVenue>
  isLoading: boolean
}

export default function ListResultsView({ data, isLoading }: ResultsViewProps) {
  return (
    <List>
      {data?.results.map((venue) => (
        <VenueListItem key={venue.id} venue={venue} />
      ))}
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : null}
    </List>
  )
}
