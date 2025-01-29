import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetVenueQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

export default function VenueDetailPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetVenueQuery(id, { skip: id == undefined })

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'Venue'))
  }, [data])

  return isLoading ? <p>Loading...</p> : <p>{data?.name}</p>
}
