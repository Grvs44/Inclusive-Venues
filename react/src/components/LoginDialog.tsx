import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import toast from 'react-hot-toast'
import { useLoginMutation } from '../redux/apiSlice'
import type { UserLogin } from '../redux/types'
import { getErrorMessage } from '../redux/utils'

export type LoginDialogProps = {
  open: boolean
  onClose: () => void
}

// Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
export default function LoginDialog(props: LoginDialogProps) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [login] = useLoginMutation()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if (data.username && data.password) {
      setLoading(true)
      const result = await login(data as UserLogin)
      setLoading(false)
      if (result.error) {
        toast.error(getErrorMessage(result.error))
      } else {
        props.onClose()
      }
    } else {
      toast.error('Username and password are required')
    }
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
        <Button
          type="submit"
          variant="contained"
          loading={loading}
          loadingPosition="start"
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}
