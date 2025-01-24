// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/ListItemButtonLink.tsx
import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton, {
  ListItemButtonProps,
} from '@mui/material/ListItemButton'
import { Link } from 'react-router-dom'

export type LinkListItemProps = { to: string } & ListItemButtonProps

export default function LinkListItem(props: LinkListItemProps) {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        {...props}
        to={import.meta.env.BASE_URL + props.to}
      />
    </ListItem>
  )
}
