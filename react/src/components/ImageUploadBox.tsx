import React from 'react'
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import FileUploadButton from './FileUploadButton'
import ImageViewDialog from './ImageViewDialog'

export type ImageUploadBoxProps = {
  files: File[]
  setFiles: (value: React.SetStateAction<File[]>) => void
}

export default function ImageUploadBox(props: ImageUploadBoxProps) {
  const [viewOpen, setViewOpen] = React.useState<boolean>(false)
  const [viewImage, setViewImage] = React.useState<File | null>(null)

  const addFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/'),
    )
    props.setFiles((files) =>
      files
        .filter((file) => newFiles.findIndex((f) => f.name == file.name) == -1)
        .concat(newFiles),
    )
  }

  const removeFile = (file: File) =>
    props.setFiles((files) => files.filter((f) => f != file))

  const openView = (file: File) => {
    setViewImage(file)
    setViewOpen(true)
  }

  return (
    <fieldset>
      <legend>
        <Typography>Images</Typography>
      </legend>
      <FileUploadButton
        text="Upload images"
        onAdd={addFiles}
        accept="image/*"
      />
      <Button onClick={() => props.setFiles([])}>Clear list</Button>
      <List>
        {props.files.map((file) => (
          <ListItem key={file.name}>
            <ListItemButton onClick={() => openView(file)}>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1000).toFixed(0)}KB`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ImageViewDialog
        open={viewOpen}
        file={viewImage}
        onClose={() => setViewOpen(false)}
        onRemove={removeFile}
      />
    </fieldset>
  )
}
