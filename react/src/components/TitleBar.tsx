// Adapted from https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/window-controls-overlay
// and https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/TitleBar.jsx
import React from 'react'
import { debounce } from '@mui/material'

export default function TitleBar() {
  const [area, setArea] = React.useState(
    navigator.windowControlsOverlay?.getTitlebarAreaRect(),
  )

  if ('windowControlsOverlay' in navigator) {
    navigator.windowControlsOverlay.addEventListener(
      'geometrychange',
      debounce((e) => {
        setArea(navigator.windowControlsOverlay.getTitlebarAreaRect())
      }),
    )

    return (
      <div
        style={{
          height: area.height * 0.4,
          width: area.width,
          WebkitAppRegion: 'drag',
        }}
      />
    )
  } else {
    return <></>
  }
}
