import React from 'react'
import Star from '@mui/icons-material/Star'
import Box from '@mui/material/Box'

export type StarBoxProps = {
  value?: number
}

export default function StarBox({ value }: StarBoxProps) {
  const stars = []
  if (value) {
    for (let i = 0; i < value; i++) {
      stars.push(<Star key={i} />)
    }
  }
  return <Box>{stars}</Box>
}
