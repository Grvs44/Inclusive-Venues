import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { VenueImage } from '../redux/types'

export default function VenueImageList({ images }: { images?: VenueImage[] }) {
  const [index, setIndex] = React.useState<number>(0)

  if (!images?.length) return null
  const image = images[index]
  return (
    <Box>
      <img
        key={image.id}
        src={image.src}
        alt={image.alt}
        title={image.alt}
        height="200"
        loading="lazy"
      />
      <Typography>{image.alt}</Typography>
      <Stack direction="row">
        <Button
          onClick={() => setIndex((index) => index - 1)}
          disabled={index == 0}
        >
          Previous
        </Button>
        <Typography>
          {index + 1} of {images.length}
        </Typography>
        <Button
          onClick={() => setIndex((index) => index + 1)}
          disabled={index + 1 == images.length}
        >
          Next
        </Button>
      </Stack>
    </Box>
  )
}
