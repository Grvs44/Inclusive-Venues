import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import type { VenueImage } from '../redux/types'
import CloseButton from './CloseButton'

export type ImageListViewerProps = {
  open: boolean
  onClose: () => void
  images?: VenueImage[]
}

const ImageListViewer: React.FC<ImageListViewerProps> = (props) => (
  <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>Images</DialogTitle>
    <CloseButton onClick={props.onClose} />
    <DialogContent>
      {props.images ? (
        <ImageList>
          {props.images.map((image) => (
            <ImageListItem key={image.id}>
              <img
                src={image.src}
                alt={image.alt}
                title={image.alt}
                height={200}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : null}
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={props.onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
)

export default ImageListViewer
