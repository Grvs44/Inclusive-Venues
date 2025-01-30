import React from 'react'
import { Link, Paper, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import VenueImageList from '../containers/VenueImageList'
import VenueInfo from '../containers/VenueInfo'
import VenueLocation from '../containers/VenueLocation'
import VenueReviews from '../containers/VenueReviews'
import { useGetVenueQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

//Test data
const images = [
  { id: 1, src: '/image1.jpg', alt: 'Image 1 alt' },
  { id: 2, src: '/image2.jpeg', alt: 'Image 2 alt' },
  { id: 3, src: '/image3.jpeg', alt: 'Image 3 alt' },
  { id: 4, src: '/image1.jpg', alt: 'Image 4 alt' },
]

export default function VenueDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isLoading } = useGetVenueQuery(id, { skip: id == undefined })

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'Venue'))
  }, [data])

  return (
    <Container sx={{ textAlign: 'center', maxWidth: 800 }}>
      {isLoading ? (
        <CircularProgress />
      ) : data ? (
        <Paper>
          <VenueImageList images={images} />
          <VenueInfo venue={data} />
          <VenueReviews />
          <VenueLocation venue={data} />
        </Paper>
      ) : (
        <Typography>
          This venue was not found -{' '}
          <Link sx={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
            go back
          </Link>
        </Typography>
      )}
    </Container>
  )
}
