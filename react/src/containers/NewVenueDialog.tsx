import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import CoordinatesInput from '../components/CoordinatesInput'
import DropDown from '../components/DropDown'
import ImageUploadBox from '../components/ImageUploadBox'
import { VenueCategory, VenueSubcategory } from '../redux/types'

//Temporary data
const categoryData: VenueCategory[] = [
  { id: 1, name: 'category 1' },
  { id: 2, name: 'category 2' },
]
const categories = { data: categoryData, isLoading: false }
const subcatData: VenueSubcategory[] = [
  { id: 1, name: 'subcategory 1', category: 1 },
  { id: 2, name: 'subcategory 2', category: 2 },
]
const subcategories = { data: subcatData, isLoading: false }

export type NewVenueDialogProps = {
  open: boolean
  onClose: () => void
}

export default function NewVenueDialog(props: NewVenueDialogProps) {
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [category, setCategory] = React.useState<VenueCategory | null>(null)
  const [subcategory, setSubcategory] = React.useState<VenueSubcategory | null>(
    null,
  )
  const [files, setFiles] = React.useState<File[]>([])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    props.onClose()
    setSubmitting(false)
  }

  return (
    // Form dialog adapted from https://mui.com/material-ui/react-dialog/#form-dialogs
    <Dialog
      open={props.open}
      onClose={props.onClose}
      slotProps={{ paper: { component: 'form', onSubmit } }}
    >
      <DialogTitle>New venue</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          autoFocus
          required
          variant="standard"
          fullWidth
          margin="dense"
          autoComplete="false"
        />
        <DropDown
          label="Category"
          data={categories.data}
          isLoading={categories.isLoading}
          getLabel={(x) => x.name}
          onChange={setCategory}
          defaultValue={category}
          required
          fullWidth
        />
        <DropDown
          label="Subcategory"
          data={subcategories.data}
          isLoading={false}
          getLabel={(x) => x.name}
          onChange={setSubcategory}
          defaultValue={subcategory}
          required
          fullWidth
          disabled={category == null}
        />
        <CoordinatesInput />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
        />
        <ImageUploadBox files={files} setFiles={setFiles} />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose} disabled={submitting}>
          Close
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
