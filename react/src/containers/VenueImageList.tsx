import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
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
      <Grid container size={12}>
        <Grid size={1} sx={{ minWidth: 'fit-content' }}>
          <Button
            aria-label="Scroll left"
            title="Scroll left"
            onClick={() => scroll(-(stackRef.current?.clientWidth || 0))}
            disabled={controls.left}
          >
            <ArrowBackIcon />
          </Button>
        </Grid>
        <Grid size="grow" />
        <Grid size={1} sx={{ minWidth: 'fit-content' }}>
          <Button
            aria-label="Scroll right"
            title="Scroll right"
            onClick={() => scroll(stackRef.current?.clientWidth || 0)}
            disabled={controls.right}
          >
            <ArrowForwardIcon />
          </Button>
        </Grid>
      </Grid>
    </Box>
  ) : null
}
