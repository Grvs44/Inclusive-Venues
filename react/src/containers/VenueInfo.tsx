import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import ShareVenueButton from '../components/ShareVenueButton'
import StarBox from '../components/StarBox'
import {
  useGetVenueCategoriesQuery,
  useGetVenueSubcategoryQuery,
} from '../redux/apiSlice'
import type { Venue } from '../redux/types'

export default function VenueInfo({ venue }: { venue: Venue }) {
  const subcategory = useGetVenueSubcategoryQuery(venue.subcategory)
  const categories = useGetVenueCategoriesQuery()

  const category = subcategory.data
    ? categories.data?.find(({ id }) => id == subcategory.data?.category)
    : undefined

  return (
    <Card>
      <Typography component="h1" variant="h4">
        {venue.name}
        <ShareVenueButton venue={venue} />
      </Typography>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="inherit" />}>
        <>Venues</>
        <>{category?.name || <Skeleton width="6em" />}</>
        <>{subcategory.data?.name || <Skeleton width="6em" />}</>
      </Breadcrumbs>
      <StarBox value={venue.score} />
      <Typography>{venue.description}</Typography>
    </Card>
  )
}
