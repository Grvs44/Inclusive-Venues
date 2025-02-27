import React from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import { useFilters } from '../providers/FilterProvider'
import { VenueCategory } from '../redux/types'
import SubcategoryFilterList from './SubcategoryFilterList'

export type FilterCategoryItemProps = {
  category: VenueCategory
}

export default function FilterCategoryItem(props: FilterCategoryItemProps) {
  const filters = useFilters()
  const subcatSelected = filters?.subcategories.find(
    (s) => s.category == props.category.id,
  )
  const [open, setOpen] = React.useState<boolean>(Boolean(subcatSelected))

  return (
    <ListItem>
      <Stack direction="column">
        <ListItemButton onClick={() => setOpen((open) => !open)}>
          <ListItemText
            primary={props.category.name}
            sx={{ fontStyle: subcatSelected ? 'italic' : 'normal' }}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <SubcategoryFilterList id={props.category.id} open={open} />
      </Stack>
    </ListItem>
  )
}
