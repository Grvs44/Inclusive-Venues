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
import toast from 'react-hot-toast'
import { redirect } from 'react-router-dom'
import CoordinatesInput from '../components/CoordinatesInput'
import DropDown from '../components/DropDown'
import ImageUploadBox from '../components/ImageUploadBox'
import type { ImageFile } from '../components/ImageViewDialog'
import { to_number } from '../components/utils'
import {
  useCreateImageMutation,
  useCreateVenueMutation,
  useGetVenueCategoriesQuery,
  useGetVenueQuery,
  useGetVenueSubcategoriesQuery,
  useGetVenueSubcategoryQuery,
} from '../redux/apiSlice'
import type { NewVenue, VenueCategory, VenueSubcategory } from '../redux/types'

export type NewVenueDialogProps = {
  open: boolean
  onClose: () => void
  venueId?: number
}

export default function NewVenueDialog(props: NewVenueDialogProps) {
  const [createVenue] = useCreateVenueMutation()
  const [createImage] = useCreateImageMutation()

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [name, setName] = React.useState<string>('')
  const [category, setCategory] = React.useState<VenueCategory | null>(null)
  const [subcategory, setSubcategory] = React.useState<VenueSubcategory | null>(
    null,
  )
  const [latitude, setLatitude] = React.useState<string>('')
  const [longitude, setLongitude] = React.useState<string>('')
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

      setLatitude(venue.data.latitude)
      setLongitude(venue.data.longitude)
      setDescription(venue.data.description || '')
      setAddress(venue.data.address || '')
      setImages([])
    }
  }, [props.venueId, venue.data, categories.data, subcategoryQuery.data])

  React.useEffect(() => {
    if (subcategoryQuery.data) setSubcategory(subcategoryQuery.data)
  }, [category])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    if (name.trim().length == 0) {
      toast.error('Venue name is required')
      return setSubmitting(false)
    }
    if (subcategory == null) {
      toast.error('Venue subcategory is required')
      return setSubmitting(false)
    }
    const latitudeValue = to_number(latitude)
    const longitudeValue = to_number(longitude)
    if (isNaN(latitudeValue) || isNaN(longitudeValue)) {
      toast.error('Coordinates must be valid numbers')
      return setSubmitting(false)
    }
    for (const image of images) {
      if (image.alt == '') {
        toast.error(`Image ${image.file.name} is missing alternative text`)
        return setSubmitting(false)
      }
    }

    const newVenue: NewVenue = {
      name,
      subcategory: subcategory.id,
      description,
      latitude: latitudeValue,
      longitude: longitudeValue,
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
    toast.success('Venue updated successfully')
  }

  // TODO
  const viewImages = () => {}

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
        <CoordinatesInput
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
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
        <ImageUploadBox images={images} setImages={setImages}>
          {props.venueId && venue.data && venue.data.images?.length ? (
            <Button disabled={venue.isFetching} onClick={viewImages}>
              View existing images ({venue.data.images.length})
            </Button>
          ) : null}
        </ImageUploadBox>
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
          {props.venueId ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
