// Adapted from https://mui.com/material-ui/react-button/#file-upload
import React from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export type FileUploadButtonProps = {
  text: String
  onAdd: (files: FileList) => void
}

export default function FileUploadButton(props: FileUploadButtonProps) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files?.length) {
      props.onAdd(event.target.files)
    }
  }

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {props.text}
      <VisuallyHiddenInput type="file" onChange={onChange} multiple />
    </Button>
  )
}
