import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
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
  useGetVenueQuery,
  useGetVenueSubcategoriesQuery,
  useGetVenueSubcategoryQuery,
} from '../redux/apiSlice'
import { NewVenue, VenueCategory, VenueSubcategory } from '../redux/types'

export type NewVenueDialogProps = {
  open: boolean
  onClose: () => void
  venueId?: number
}

export default function NewVenueDialog(props: NewVenueDialogProps) {
  console.log(`venueId=${props.venueId}`)
  const [createVenue] = useCreateVenueMutation()
  const [createImage] = useCreateImageMutation()

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [name, setName] = React.useState<string>('')
  const [category, setCategory] = React.useState<VenueCategory | null>(null)
  const [subcategory, setSubcategory] = React.useState<VenueSubcategory | null>(
    null,
  )
  const [description, setDescription] = React.useState<string>('')
  const [address, setAddress] = React.useState<string>('')
  const [images, setImages] = React.useState<ImageFile[]>([])

  const categories = useGetVenueCategoriesQuery(undefined, {
    skip: !props.open,
  })
  const subcategories = useGetVenueSubcategoriesQuery(category?.id, {
    skip: !props.open || category == null,
  })
  const venue = useGetVenueQuery(props.venueId, {
    skip: !props.open || props.venueId == undefined,
  })
  const subcategoryQuery = useGetVenueSubcategoryQuery(
    venue.data?.subcategory,
    { skip: venue.data == undefined },
  )

  React.useEffect(() => setSubcategory(null), [category])

  React.useEffect(() => {
    if (props.venueId == undefined) {
      setName('')
      setCategory(null)
      setSubcategory(null)
      setDescription('')
      setAddress('')
      setImages([])
    } else if (venue.data && categories.data && subcategoryQuery.data) {
      setName(venue.data.name)
      const subcategory = subcategoryQuery.data
      setCategory(
        categories.data.find((c) => c.id == subcategory.category) || null,
      )
      setSubcategory(subcategory)
      setDescription(venue.data.description || '')
      setAddress(venue.data.address || '')
    }
  }, [props.venueId, venue.data, categories.data, subcategoryQuery.data])

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
      <DialogTitle>
        {props.venueId
          ? venue.data?.name || <Skeleton sx={{ width: '10em' }} />
          : 'New venue'}
      </DialogTitle>
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
          disabled={venue.isFetching}
          value={name}
          onChange={(event) => setName(event.target.value)}
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
          disabled={categories.data == undefined || venue.isFetching}
        />
        <DropDown
          label="Subcategory"
          data={subcategories.data || []}
          isFetching={subcategories.isFetching}
          getLabel={(x) => x.name}
          onChange={setSubcategory}
          value={subcategory}
          required
          fullWidth
          disabled={subcategories.data == undefined || venue.isFetching}
        />
        <CoordinatesInput />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
          disabled={venue.isFetching}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="dense"
          multiline
          disabled={venue.isFetching}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <ImageUploadBox images={images} setImages={setImages} />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose} disabled={submitting}>
          Close
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || venue.isFetching}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
