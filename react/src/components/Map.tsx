import React from 'react'
import { AzureMap } from 'react-azure-maps'
import mapOptions from '../config/mapOptions'

export default function Map(props: Parameters<typeof AzureMap>[0]) {
  return (
    <AzureMap
      {...props}
      options={{ ...mapOptions, ...props.options }}
      styleOptions={{ showLogo: false, showFeedbackLink: false }}
    />
  )
}
