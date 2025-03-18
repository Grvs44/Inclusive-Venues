import React from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { useFilters } from '../providers/FilterProvider'
import { useGetVenueSubcategoriesQuery } from '../redux/apiSlice'
import LoadingSkeleton from './LoadingSkeleton'

export type SubcategoryFilterListProps = {
  id: number
  open: boolean
}

export default function SubcategoryFilterList(
  props: SubcategoryFilterListProps,
) {
  const filters = useFilters()
  const { data, isFetching } = useGetVenueSubcategoriesQuery(props.id, {
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
              control={
                <Checkbox
                  onChange={(_, on) =>
                    on
                      ? filters?.addSubcategories([s])
                      : filters?.removeSubcategories([s])
                  }
                  checked={filters?.subcategories.includes(s)}
                />
              }
            />
          ))}
          <LoadingSkeleton isFetching={isFetching} />
        </FormGroup>
      </FormControl>
    </Box>
  ) : (
    <></>
  )
}
