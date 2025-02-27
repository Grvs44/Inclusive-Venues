import React from 'react'
import List from '@mui/material/List'
import FilterCategoryItem from '../components/FilterCategoryItem'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useGetVenueCategoriesQuery } from '../redux/apiSlice'

export default function FilterArea() {
  const { data, isLoading } = useGetVenueCategoriesQuery()
  return (
    <List>
      {data?.map((c) => <FilterCategoryItem key={c.id} category={c} />)}
      <LoadingSkeleton isLoading={isLoading} />
    </List>
  )
}
