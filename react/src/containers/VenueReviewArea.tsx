import React from 'react'
import { Box, Button, List, Typography } from '@mui/material'
import LoadingSkeleton from '../components/LoadingSkeleton'
import VenueReviewListItem from '../components/VenueReviewListItem'
import { useGetVenueReviewsQuery } from '../redux/apiSlice'

export type VenueReviewAreaProps = {
  id: number
  children?: React.ReactNode
}

export default function VenueReviewArea({
  id,
  children,
}: VenueReviewAreaProps) {
  const [page, setPage] = React.useState<number>(1)
  const { data, isFetching } = useGetVenueReviewsQuery({ id, page })
  return (
    <Box>
      <Typography component="h2" variant="h5">
        Reviews
      </Typography>
      {children}
      <List>
        {isFetching
          ? null
          : data?.results.map((review) => (
              <VenueReviewListItem key={review.id} review={review} />
            ))}
        <LoadingSkeleton isFetching={isFetching} />
      </List>
      {data?.next ? (
        <Button
          onClick={() => setPage((page) => page + 1)}
          disabled={isFetching}
        >
          Load more
        </Button>
      ) : null}
    </Box>
  )
}
