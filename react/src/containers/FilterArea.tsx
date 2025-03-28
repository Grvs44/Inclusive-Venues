import React from 'react'
import List from '@mui/material/List'
import ErrorBox from '../components/ErrorBox'
import FilterCategoryItem from '../components/FilterCategoryItem'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useGetVenueCategoriesQuery } from '../redux/apiSlice'

export default function FilterArea() {
  const { data, error, isError, isFetching, refetch } =
    useGetVenueCategoriesQuery()
  return (
    <List>
      {isError ? (
        <ErrorBox error={error} retry={refetch} />
      ) : (
        data?.map((c) => <FilterCategoryItem key={c.id} category={c} />)
      )}
      <LoadingSkeleton isFetching={isFetching} />
    </List>
  )
}
