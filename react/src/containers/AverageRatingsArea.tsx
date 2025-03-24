import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import StarBox from '../components/StarBox'
import { useGetVenueReviewAggregationQuery } from '../redux/apiSlice'

export type AverageRatingsBoxProps = {
  id: number
}

export default function AverageRatingsArea(props: AverageRatingsBoxProps) {
  const { data, isFetching } = useGetVenueReviewAggregationQuery(props.id)

  return (
    <Card>
      <Typography component="h2" variant="h5">
        Average ratings
      </Typography>
      <Grid
        container
        columnSpacing={{ xs: 2, md: 3 }}
        rowSpacing={0}
        columns={{ xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }}
      >
        {data?.map((rating) => (
          <Grid key={rating.category} size={4} color="GrayText">
            <Typography>{rating.category}</Typography>
            <StarBox value={rating.value} sx={{ fontSize: 'inherit' }} />
          </Grid>
        ))}
      </Grid>
      {isFetching ? <Skeleton /> : null}
    </Card>
  )
}
