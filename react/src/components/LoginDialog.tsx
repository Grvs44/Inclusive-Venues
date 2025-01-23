import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { UserLogin } from '../redux/types'

export type LoginDialogProps = {
  open: boolean
  onClose: () => void
  onLogin: (details: UserLogin) => void
}

export default function LoginDialog(props: LoginDialogProps) {
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const login: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (username && password) props.onLogin({ username, password })
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form onSubmit={login}>
        <DialogTitle>Account</DialogTitle>
        <DialogContent>
          <label>
            Username:{' '}
            <input type="text" name="username" ref={usernameRef} required />
          </label>
          <label>
            Password:{' '}
            <input type="password" name="password" ref={passwordRef} required />
          </label>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={props.onClose}>
            Close
          </Button>
          <Button type="submit" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
