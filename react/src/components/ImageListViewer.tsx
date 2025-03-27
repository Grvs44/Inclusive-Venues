import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
} from '@mui/material'
import type { VenueImage } from '../redux/types'

export type ImageListViewerProps = {
  open: boolean
  onClose: () => void
  images?: VenueImage[]
}

const ImageListViewer: React.FC<ImageListViewerProps> = (props) => (
  <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>Images</DialogTitle>
    <DialogContent>
      {props.images ? (
        <ImageList>
          {props.images.map((image) => (
            <ImageListItem key={image.id}>
              <img src={image.src} alt={image.alt} title={image.alt} />
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
