import React from 'react'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import VenueListItem from '../components/VenueListItem'
import { useGetVenuesQuery } from '../redux/apiSlice'

export default function ListResultsView() {
  const { data, isLoading } = useGetVenuesQuery({})

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
