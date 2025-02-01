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
          <VenueImageList images={data.images} />
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
