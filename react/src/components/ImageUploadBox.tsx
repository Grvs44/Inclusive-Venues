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
import ImageViewDialog, { ImageFile } from './ImageViewDialog'

export type ImageUploadBoxProps = {
  images: ImageFile[]
  setImages: (value: React.SetStateAction<ImageFile[]>) => void
  children?: React.ReactNode
  disabled?: boolean
}

export default function ImageUploadBox(props: ImageUploadBoxProps) {
  const [viewOpen, setViewOpen] = React.useState<boolean>(false)
  const [viewImage, setViewImage] = React.useState<ImageFile | null>(null)

  const addFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/'),
    )
    props.setImages((files) =>
      files
        .filter(
          ({ file }) => newFiles.findIndex((f) => f.name == file.name) == -1,
        )
        .concat(newFiles.map((file) => ({ alt: '', file }))),
    )
  }

  const removeFile = ({ file }: ImageFile) =>
    props.setImages((files) => files.filter((i) => i.file != file))

  const saveFile = (image: ImageFile) =>
    props.setImages((images) => {
      const img = images.find(({ file }) => file == image.file)
      if (img) img.alt = image.alt
      return images
    })

  const openView = (image: ImageFile) => {
    setViewImage(image)
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
        disabled={props.disabled}
      />
      <Button onClick={() => props.setImages([])} disabled={props.disabled}>
        Clear list
      </Button>
      {props.children}
      <List>
        {props.images.map((image) => (
          <ListItem key={image.file.name}>
            <ListItemButton onClick={() => openView(image)}>
              <ListItemText
                primary={image.file.name}
                secondary={
                  <>
                    <Typography>
                      {(image.file.size / 1000).toFixed(0)}KB
                    </Typography>
                    <Typography>{image.alt || '(missing alt text)'}</Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ImageViewDialog
        open={viewOpen}
        image={viewImage}
        onClose={() => setViewOpen(false)}
        onRemove={removeFile}
        onSave={saveFile}
      />
    </fieldset>
  )
}
