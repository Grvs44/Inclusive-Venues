import React from 'react'
import Button from '@mui/material/Button'
import type { VenueImage } from '../redux/types'
import ImageListViewer from './ImageListViewer'

export type ExistingImageButtonProps = {
  show: boolean
  images?: VenueImage[]
  disabled?: boolean
}

export default function ExistingImageButton(props: ExistingImageButtonProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  return props.show && props.images?.length ? (
    <>
      <Button disabled={props.disabled} onClick={() => setOpen(true)}>
        View existing images ({props.images.length})
      </Button>
      <ImageListViewer
        open={open}
        onClose={() => setOpen(false)}
        images={props.images}
      />
    </>
  ) : null
}
