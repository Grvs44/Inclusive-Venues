import React from 'react'
import Star from '@mui/icons-material/Star'
import type { SvgIconProps } from '@mui/material'
import Box from '@mui/material/Box'
import { starColours } from '../theme'

export type StarBoxProps = {
  value?: number | string
} & SvgIconProps

export default function StarBox({ value, ...props }: StarBoxProps) {
  if (!value) return null
  const stars = []
  const numValue = Math.round(Number(value))
  for (let i = 0; i < numValue; i++) {
    stars.push(
      <Star key={i} style={{ color: starColours[numValue - 1] }} {...props} />,
    )
  }
  return (
    <Box>
      {stars} {value}
    </Box>
  )
}
