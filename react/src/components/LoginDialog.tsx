import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { UserLogin } from '../redux/types'

export type LoginDialogProps = {
  open: boolean
  onClose: () => void
  onLogin: (details: UserLogin) => void
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function LoginDialog(props: LoginDialogProps) {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if (data.username && data.password) props.onLogin(data as UserLogin)
    props.onClose()
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      slotProps={{ paper: { component: 'form', onSubmit } }}
    >
      <DialogTitle>Log in</DialogTitle>
      <DialogContent>
        <TextField
          name="username"
          label="Username"
          autoFocus
          required
          variant="standard"
          fullWidth
          margin="dense"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          required
          variant="standard"
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>
          Close
        </Button>
        <Button type="submit" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}
