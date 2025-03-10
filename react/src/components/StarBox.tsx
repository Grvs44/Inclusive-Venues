import React from 'react'
import Star from '@mui/icons-material/Star'
import type { SvgIconProps } from '@mui/material'
import Box from '@mui/material/Box'

export type StarBoxProps = {
  value?: number
} & SvgIconProps

export default function StarBox({ value, ...props }: StarBoxProps) {
  if (!value) return null
  const stars = []
  for (let i = 0; i < Math.round(value); i++) {
    stars.push(<Star key={i} {...props} />)
  }
  return (
    <Box>
      {stars} {value}
    </Box>
  )
}
