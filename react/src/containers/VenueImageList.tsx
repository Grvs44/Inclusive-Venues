import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import type { VenueImage } from '../redux/types'

export default function VenueImageList({ images }: { images?: VenueImage[] }) {
  const stackRef = React.useRef<HTMLDivElement | null>(null)
  const [controls, setControls] = React.useState<{
    left: boolean
    right: boolean
  }>({ left: true, right: true })

  const scroll = (amount: number) =>
    stackRef.current?.scrollBy({ left: amount, behavior: 'smooth' })

  const updateControls = () => {
    const e = stackRef.current
    setControls({
      left: e == null || e.scrollLeft == 0,
      right: e == null || e.scrollLeft + e.clientWidth >= e.scrollWidth,
    })
  }

  React.useEffect(() => {
    if (stackRef.current) {
      stackRef.current.onscroll = updateControls
      updateControls()
    }
  }, [stackRef.current])

  return images?.length ? (
    <Box>
      <Stack
        direction="row"
        sx={{ overflowX: 'auto', overflowY: 'hidden' }}
        spacing={1}
        ref={stackRef}
      >
        {images.map(({ id, src, alt }) => (
          <img key={id} src={src} alt={alt} title={alt} height={200} />
        ))}
      </Stack>
      <Stack direction="row">
        <Button
          aria-label="Scroll left"
          onClick={() => scroll(-200)}
          disabled={controls.left}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          aria-label="Scroll right"
          onClick={() => scroll(200)}
          disabled={controls.right}
        >
          <ArrowForwardIcon />
        </Button>
      </Stack>
    </Box>
  ) : null
}
