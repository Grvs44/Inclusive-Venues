import React from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import FileUploadButton from './FileUploadButton'
import ImageViewDialog from './ImageViewDialog'

export type ImageUploadBoxProps = {
  files: File[]
  setFiles: (value: React.SetStateAction<File[]>) => void
}

export default function ImageUploadBox(props: ImageUploadBoxProps) {
  const [viewOpen, setViewOpen] = React.useState<boolean>(false)
  const [viewImage, setViewImage] = React.useState<File | null>(null)

  const addFiles = (newFiles: FileList) =>
    props.setFiles((files) =>
      files.concat(
        Array.from(newFiles).filter(
          (newFile) => files.findIndex((f) => f.name == newFile.name) == -1,
        ),
      ),
    )

  const removeFile = (file: File) =>
    props.setFiles((files) => files.filter((f) => f != file))

  const openView = (file: File) => {
    setViewImage(file)
    setViewOpen(true)
  }

  return (
    <fieldset>
      <legend>Images</legend>
      <FileUploadButton text="Upload images" onAdd={addFiles} />
      <List>
        {props.files.map((file) => (
          <ListItem key={file.name}>
            <ListItemButton onClick={() => openView(file)}>
              <ListItemText
                primary={file.name}
                secondary={`${file.type} - ${file.size / 1000}KB`}
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
