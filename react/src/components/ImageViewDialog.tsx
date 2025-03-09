import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

export type ImageViewDialogProps = {
  open: boolean
  onClose: () => void
  onRemove: (file: File) => void
  file: File | null
}

export default function ImageViewDialog(props: ImageViewDialogProps) {
  const [src, setSrc] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (props.file == null) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result == 'string') {
        setSrc(reader.result)
      }
    }
    reader.readAsDataURL(props.file)
  }, [props.file])

  const onRemove = () => {
    if (props.file) props.onRemove(props.file)
    props.onClose()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.file?.name}</DialogTitle>
      <DialogContent>
        <img
          alt="Venue image"
          src={src}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onRemove}>
          Remove
        </Button>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
