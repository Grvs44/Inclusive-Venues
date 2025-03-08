import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

export type NewVenueDialogProps = {
  open: boolean
  onClose: () => void
}

export default function NewVenueDialog(props: NewVenueDialogProps) {
  const [submitting, setSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    props.onClose()
    setSubmitting(false)
  }

  return (
    // Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
    <Dialog
      open={props.open}
      onClose={props.onClose}
      slotProps={{ paper: { component: 'form', onSubmit } }}
    >
      <DialogTitle>New venue</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          autoFocus
          required
          variant="standard"
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose} disabled={submitting}>
          Close
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
