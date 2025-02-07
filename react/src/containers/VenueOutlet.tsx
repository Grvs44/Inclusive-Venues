import React from 'react'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Outlet } from 'react-router-dom'
import theme from '../theme'

export type VenueOutletProps = {
  id?: string
}

export default function VenueOutlet({ id }: VenueOutletProps) {
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={id != undefined}
      onClose={() => history.back()}
    >
      <Outlet />
    </Dialog>
  )
}
