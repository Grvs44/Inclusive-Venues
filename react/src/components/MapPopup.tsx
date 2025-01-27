import React from 'react'
import { Popper, Typography } from '@mui/material'
import { AzureDataPosition, AzureMapPopup } from 'react-azure-maps'
import { ListVenue } from '../redux/types'

export type PopupState =
  | {
      position: AzureDataPosition
      venue: ListVenue
    }
  | undefined

export type MapPopupProps = {
  state: PopupState
}

export default function MapPopup({ state }: MapPopupProps) {
  const open = state != undefined
  return (
    <AzureMapPopup
      isVisible={open}
      options={{ position: state?.position }}
      popupContent={
        <Popper open={open}>
          <Typography component="p">{state?.venue.name}</Typography>
        </Popper>
      }
    />
  )
}
