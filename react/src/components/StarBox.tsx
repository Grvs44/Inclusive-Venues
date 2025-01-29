import React from 'react'
import Star from '@mui/icons-material/Star'
import type { SvgIconProps } from '@mui/material'
import Box from '@mui/material/Box'

export type StarBoxProps = {
  value?: number
} & SvgIconProps

export default function StarBox({ value, ...props }: StarBoxProps) {
  const stars = []
  if (value) {
    for (let i = 0; i < value; i++) {
      stars.push(<Star key={i} {...props} />)
    }
  }
  return <Box>{stars}</Box>
}
