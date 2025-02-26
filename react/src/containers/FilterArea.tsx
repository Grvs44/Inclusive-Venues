import React from 'react'
import { Box, Typography } from '@mui/material'
import LoadingSkeleton from '../components/LoadingSkeleton'
import SubcategoryFilterList from '../components/SubcategoryFilterList'
import { useGetVenueCategoriesQuery } from '../redux/apiSlice'

export default function FilterArea() {
  const { data, isLoading } = useGetVenueCategoriesQuery()
  return (
    <Box>
      {data?.map((c) => (
        <Box key={c.id}>
          <Typography>{c.name}</Typography>
          <SubcategoryFilterList id={c.id} open />
        </Box>
      ))}
      <LoadingSkeleton isLoading={isLoading} />
    </Box>
  )
}
