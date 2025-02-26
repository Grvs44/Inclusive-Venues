import React from 'react'
import { Box, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useGetVenueSubcategoriesQuery } from '../redux/apiSlice'
import LoadingSkeleton from './LoadingSkeleton'

export type SubcategoryFilterListProps = {
  id: number
  open: boolean
}

export default function SubcategoryFilterList(
  props: SubcategoryFilterListProps,
) {
  const [page, setPage] = React.useState<number>(1)
  const { data, isLoading } = useGetVenueSubcategoriesQuery(
    { page, category: props.id },
    { skip: !props.open },
  )
  return props.open ? (
    <Box>
      <RadioGroup>
        {data?.results.map((s) => (
          <FormControlLabel key={s.id} value={s.id} label={s.name} control={<Radio />} />
        ))}
        <LoadingSkeleton isLoading={isLoading}/>
      </RadioGroup>
      {data?.next ? (
        <Button variant="contained" onClick={() => setPage((page) => page + 1)}>
          Load more
        </Button>
      ) : null}
    </Box>
  ) : (
    <></>
  )
}
