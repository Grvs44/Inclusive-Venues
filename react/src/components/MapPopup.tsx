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
  console.log(state)
  return (
    <AzureMapPopup
      isVisible={state != undefined}
      options={{ position: state?.position,closeButton:false }}
      popupContent={
          <Typography component="p">{state?.venue.name}</Typography>
      }
    />
  )
}
