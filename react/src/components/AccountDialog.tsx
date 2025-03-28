import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { useLogoutMutation } from '../redux/apiSlice'
import type { LoggedInUser } from '../redux/types'
import { getErrorMessage } from '../redux/utils'

export type AccountDialogProps = {
  open: boolean
  onClose: () => void
  user: LoggedInUser
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/AccountListItem.tsx
export default function AccountDialog(props: AccountDialogProps) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [logout] = useLogoutMutation()

  const onLogout = async () => {
    setLoading(true)
    const result = await logout()
    setLoading(false)
    if (result.error) {
      toast.error(getErrorMessage(result.error))
    } else {
      props.onClose()
    }
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
        <Button
          onClick={onLogout}
          type="submit"
          variant="contained"
          loading={loading}
          loadingPosition="start"
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}
