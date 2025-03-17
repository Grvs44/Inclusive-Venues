import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Link from '../components/Link'
import StarBox from '../components/StarBox'
import { Venue } from '../redux/types'

//Test data
const category = { data: { id: 1, name: 'Category' } }
const subcategory = { data: { id: 1, name: 'Subcategory' } }

export default function VenueInfo({ venue }: { venue: Venue }) {
  return (
    <Card>
      <Typography component="h1" variant="h4">
        {venue.name}
      </Typography>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="inherit" />}>
        <Link to="/venue">Venues</Link>
        <Link to={`/venue?cat=${category.data.id}`}>{category.data.name}</Link>
        <Link to={`/venue?sub=${subcategory.data.id}`}>
          {subcategory.data.name}
        </Link>
      </Breadcrumbs>
      <StarBox value={venue.score} />
      <Typography>{venue.description}</Typography>
    </Card>
  )
}
