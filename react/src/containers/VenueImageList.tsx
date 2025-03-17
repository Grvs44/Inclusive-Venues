import React from 'react'
import Stack from '@mui/material/Stack'
import { VenueImage } from '../redux/types'

export default function VenueImageList({ images }: { images?: VenueImage[] }) {
  return images ? (
    <Stack
      direction="row"
      sx={{ overflowX: 'auto', overflowY: 'hidden' }}
      spacing={1}
    >
      {images.map(({ id, src, alt }) => (
        <img
          key={id}
          src={src}
          alt={alt}
          title={alt}
          height={200}
          loading="lazy"
        />
      ))}
    </Stack>
  ) : null
}
