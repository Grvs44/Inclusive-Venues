import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { redirect } from 'react-router-dom'
import CoordinatesInput from '../components/CoordinatesInput'
import DropDown from '../components/DropDown'
import ImageUploadBox from '../components/ImageUploadBox'
import type { ImageFile } from '../components/ImageViewDialog'
import {
  useCreateImageMutation,
  useCreateVenueMutation,
  useGetVenueCategoriesQuery,
  useGetVenueSubcategoriesQuery,
} from '../redux/apiSlice'
import { NewVenue, VenueCategory, VenueSubcategory } from '../redux/types'

export type NewVenueDialogProps = {
  open: boolean
  onClose: () => void
}

export default function NewVenueDialog(props: NewVenueDialogProps) {
  const [createVenue] = useCreateVenueMutation()
  const [createImage] = useCreateImageMutation()

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [category, setCategory] = React.useState<VenueCategory | null>(null)
  const [subcategory, setSubcategory] = React.useState<VenueSubcategory | null>(
    null,
  )
  const [images, setImages] = React.useState<ImageFile[]>([])

  const categories = useGetVenueCategoriesQuery(undefined, {
    skip: !props.open,
  })
  const subcategories = useGetVenueSubcategoriesQuery(category?.id, {
    skip: !props.open || category == null,
  })

  React.useEffect(() => setSubcategory(null), [category])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if (!('name' in data)) {
      alert('Venue name is required')
      return setSubmitting(false)
    }
    if (!('description' in data)) {
      alert('Venue description is required')
      return setSubmitting(false)
    }
    if (subcategory == null) {
      alert('Venue subcategory is required')
      return setSubmitting(false)
    }
    for (const image of images) {
      if (image.alt == '') {
        alert(`Image ${image.file.name} is missing alternative text`)
        return setSubmitting(false)
      }
    }
    const newVenue: NewVenue = {
      name: data.name.toString(),
      subcategory: subcategory.id,
      description: data.description.toString(),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    }
    const result = await createVenue(newVenue)
    if (result.data) {
      console.log('uploading images')
      images.forEach((image, index) => {
        const formData = new FormData()
        formData.append('venue', result.data.id.toString())
        formData.append('alt', image.alt)
        formData.append('order', index.toString())
        formData.append('src', image.file, image.file.name)
        createImage(formData)
      })
      redirect(`/venue/${result.data.id}`)
      props.onClose()
    } else {
      alert(
        'data' in result.error && Array.isArray(result.error.data)
          ? result.error.data
          : 'Unknown error',
      )
    }
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
          data={categories.data || []}
          isFetching={categories.isFetching}
          getLabel={(x) => x.name}
          onChange={setCategory}
          value={category}
          required
          fullWidth
          disabled={categories.data == undefined}
        />
        <DropDown
          label="Subcategory"
          data={subcategories.data || []}
          isFetching={false}
          getLabel={(x) => x.name}
          onChange={setSubcategory}
          value={subcategory}
          required
          fullWidth
          disabled={subcategories.data == undefined}
        />
        <CoordinatesInput />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="dense"
          multiline
        />
        <ImageUploadBox images={images} setImages={setImages} />
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
