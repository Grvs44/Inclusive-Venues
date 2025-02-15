import React from 'react'
import Star from '@mui/icons-material/Star'
import StarBorder from '@mui/icons-material/StarBorder'
import type { SvgIconProps } from '@mui/material'
import Box from '@mui/material/Box'

export type RateBoxProps = {
  defaultValue?: number
  valueRef: React.RefObject<number>
} & SvgIconProps

export default function RateBox({ defaultValue,valueRef, ...props }: RateBoxProps) {
  const [selected,setSelected] = React.useState<number>(defaultValue || 0)
  
  const onRate = (value:number)=>{
    valueRef.current = value
    setSelected(value)
  }

  const stars = []
  for (let i = 1; i <= selected; i++) {
    stars.push(<Star key={i} onClick={() => onRate(i)} {...props} />)
  }
  for (let i = selected + 1; i <= 5; i++) {
    stars.push(<StarBorder key={i} onClick={() => onRate(i)} {...props} />)
  }

  return <Box>{stars}</Box>
}
