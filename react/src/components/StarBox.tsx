import React from 'react'
import Star from '@mui/icons-material/Star'
import Box from '@mui/material/Box'

export type StarBoxProps = {
  value?: number
}

export default function StarBox({ value }: StarBoxProps) {
  console.log(value)
  return (
    <Box>
      {new Array(value?value:0).map((_v, index) => {console.log(index);return(
        <Star key={index} />
      )})}
    </Box>
  )
}
