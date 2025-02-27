import React from 'react'
import { TextField } from '@mui/material'

export type RadiusInputProps = {
  radius: string
  setRadius: (radius: string) => void
}

export default function RadiusInput(props: RadiusInputProps) {
  return (
    <TextField
      name="radius"
      label="Search radius (km)"
      type="number"
      slotProps={{ htmlInput: { min: 1, step: 0.1 } }}
      value={props.radius}
      onChange={(event) => props.setRadius(event.currentTarget.value)}
    />
  )
}
