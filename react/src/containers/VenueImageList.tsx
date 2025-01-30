import React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Image } from '../redux/types'

export default function VenueImageList({ images }: { images?: Image[] }) {
  return images ? (
    <ImageList
      cols={images.length}
      sx={{ overflowX: 'auto', overflowY: 'hidden' }}
      rowHeight={200}
    >
      {images.map(({ id, src, alt }) => (
        <ImageListItem key={id}>
          <img src={src} alt={alt} title={alt} loading="lazy" />
        </ImageListItem>
      ))}
    </ImageList>
  ) : null
}
