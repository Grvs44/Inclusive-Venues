import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

export type ImageFile = {
  alt: string
  file: File
}

export type ImageViewDialogProps = {
  open: boolean
  onClose: () => void
  onRemove: (file: ImageFile) => void
  onSave: (image: ImageFile) => void
  image: ImageFile | null
}

export default function ImageViewDialog(props: ImageViewDialogProps) {
  const [src, setSrc] = React.useState<string | undefined>(undefined)
  const [alt, setAlt] = React.useState<string>(props.image?.alt || '')

  React.useEffect(() => {
    if (props.image == null) return
    setAlt(props.image.alt)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result == 'string') {
        setSrc(reader.result)
      }
    }
    reader.readAsDataURL(props.image.file)
  }, [props.image])

  const onRemove = () => {
    if (props.image) props.onRemove(props.image)
    props.onClose()
  }

  const onSave = () => {
    if (props.image) props.onSave({ alt, file: props.image.file })
    props.onClose()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.image?.file.name}</DialogTitle>
      <DialogContent>
        <img
          alt={alt}
          src={src}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        <TextField
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          label="Alt text"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <Button variant="contained" color="error" onClick={onRemove}>
          Remove
        </Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
