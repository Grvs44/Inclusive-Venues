import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { LoggedInUser } from '../redux/types'

export type AccountDialogProps = {
  open: boolean
  onClose: () => void
  user: LoggedInUser
  onLogout: () => void
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/AccountListItem.tsx
export default function AccountDialog(props: AccountDialogProps) {
  const logout = () => {
    props.onLogout()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <Typography>Username: {props.user.username}</Typography>
        {props.user.firstName || props.user.lastName ? (
          <Typography>
            Name: {props.user.firstName} {props.user.lastName}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>
          Close
        </Button>
        <Button onClick={logout} type="submit" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}
