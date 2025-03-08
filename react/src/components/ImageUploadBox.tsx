import React from 'react'
import { List, ListItem, ListItemText } from '@mui/material'
import FileUploadButton from './FileUploadButton'

export type ImageUploadBoxProps = {
  files: File[]
  setFiles: (value: React.SetStateAction<File[]>) => void
}

export default function ImageUploadBox(props: ImageUploadBoxProps) {
  const addFiles = (newFiles: FileList) =>
    props.setFiles((files) =>
      files.concat(
        Array.from(newFiles).filter(
          (newFile) => files.findIndex((f) => f.name == newFile.name) == -1,
        ),
      ),
    )

  return (
    <fieldset>
      <legend>Images</legend>
      <FileUploadButton text="Upload images" onAdd={addFiles} />
      <List>
        {props.files.map((file) => (
          <ListItem key={file.name}>
            <ListItemText
              primary={file.name}
              secondary={`${file.type} - ${file.size / 1000}KB`}
            />
          </ListItem>
        ))}
      </List>
    </fieldset>
  )
}
