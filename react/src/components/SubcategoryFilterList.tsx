import React from 'react'
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup} from '@mui/material'
import { useGetVenueSubcategoriesQuery } from '../redux/apiSlice'
import LoadingSkeleton from './LoadingSkeleton'

export type SubcategoryFilterListProps = {
  id: number
  open: boolean
}

export default function SubcategoryFilterList(
  props: SubcategoryFilterListProps,
) {
  const { data, isLoading } = useGetVenueSubcategoriesQuery(props.id, {
    skip: !props.open,
  })
  return props.open ? (
    <Box>
      <FormControl>
        <FormGroup>
        {data?.map((s) => (
          <FormControlLabel
            key={s.id}
            value={s.id}
            label={s.name}
            control={<Checkbox />}
          />
        ))}
        <LoadingSkeleton isLoading={isLoading} /></FormGroup>
      </FormControl>
    </Box>
  ) : (
    <></>
  )
}
