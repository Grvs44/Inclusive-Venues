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
  const imageRef = React.useRef<HTMLImageElement | null>(null)

  React.useEffect(() => {
    const img = imageRef.current
    if (img == null || props.file == null) return
    const reader = new FileReader()
    reader.onload = () => {
      if (img && typeof reader.result == 'string') {
        img.src = reader.result
      }
    }
    reader.readAsDataURL(props.file)
  }, [imageRef.current])

  const onRemove = () => {
    if (props.file) props.onRemove(props.file)
    props.onClose()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.file?.name}</DialogTitle>
      <DialogContent>
        <img alt="Venue image" ref={imageRef} />
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
