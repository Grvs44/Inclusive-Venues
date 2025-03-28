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
import ErrorBox from './ErrorBox'
import LoadingSkeleton from './LoadingSkeleton'

export type SubcategoryFilterListProps = {
  id: number
  open: boolean
}

export default function SubcategoryFilterList(
  props: SubcategoryFilterListProps,
) {
  const filters = useFilters()
  const { data, error, isError, isFetching, refetch } =
    useGetVenueSubcategoriesQuery(props.id, { skip: !props.open })

  return props.open ? (
    <Box>
      {isError ? (
        <ErrorBox error={error} retry={refetch} sx={{ textAlign: 'center' }} />
      ) : (
        <FormControl sx={{ width: '100%' }}>
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
      )}
    </Box>
  ) : null
}
