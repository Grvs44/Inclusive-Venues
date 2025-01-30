import React from 'react'
import MLink, { LinkProps as MProps } from '@mui/material/Link'
import { Link as RLink, LinkProps as RProps } from 'react-router-dom'

export type LinkProps = MProps & RProps

export default (props: LinkProps) => {
  return <MLink component={RLink} {...props} />
}
