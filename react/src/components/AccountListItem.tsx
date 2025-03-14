import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { User } from '../redux/types'
import AccountDialog from './AccountDialog'
import LoginDialog from './LoginDialog'

export type AccountListItemProps = {
  user?: User
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/AccountListItem.tsx
const AccountListItem = (props: AccountListItemProps) => {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <ListItem>
      <ListItemButton onClick={() => setOpen(true)}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText>{props.user?.username || 'Log in'}</ListItemText>
      </ListItemButton>
      {props.user ? (
        <AccountDialog
          open={open}
          onClose={() => setOpen(false)}
          user={props.user}
        />
      ) : (
        <LoginDialog open={open} onClose={() => setOpen(false)} />
      )}
    </ListItem>
  )
}

export default AccountListItem
