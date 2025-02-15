import React from 'react'
import Star from '@mui/icons-material/Star'
import StarBorder from '@mui/icons-material/StarBorder'
import type { SvgIconProps } from '@mui/material'
import Box from '@mui/material/Box'

export type RateBoxProps = {
  value: number
  onRate: (value: number) => void
  onDelete: () => void
} & SvgIconProps

export default function RateBox({
  value,
  onRate,
  onDelete,
  ...props
}: RateBoxProps) {
  const stars = []
  for (let i = 1; i <= value; i++) {
    stars.push(<Star key={i} onClick={() => onRate(i)} {...props} />)
  }
  for (let i = value + 1; i <= 5; i++) {
    stars.push(<StarBorder key={i} onClick={() => onRate(i)} {...props} />)
  }

  return <Box>{stars}</Box>
}
