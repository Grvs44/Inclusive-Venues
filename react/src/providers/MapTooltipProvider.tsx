import React from 'react'
import Tooltip from '@mui/material/Tooltip'

export type MapTooltipProviderProps = {
  children: React.ReactNode
}

export type MapTooltipContextType = {
  setText?: (text: string) => void
  clearText?: () => void
}

export const MapTooltipContext = React.createContext<MapTooltipContextType>({})

export default function MapTooltipProvider(props: MapTooltipProviderProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const [title, setTitle] = React.useState<string>('')

  const value: MapTooltipContextType = {
    setText(text) {
      console.log('settext')
      setTitle(text)
      setOpen(true)
    },
    clearText() {
      console.log('cleartext')
      setOpen(false)
    },
  }

  return (
    <Tooltip title={title} open={open} followCursor>
      <MapTooltipContext.Provider value={value}>
        {props.children}
      </MapTooltipContext.Provider>
    </Tooltip>
  )
}
