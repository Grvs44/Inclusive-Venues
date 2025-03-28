import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const getErrorMessage = (
  error?: FetchBaseQueryError | SerializedError,
) => {
  if (error == undefined) {
    return 'Unkown error'
  } else if ('data' in error && error.data) {
    if (Array.isArray(error.data)) {
      return error.data[0]
    } else if ('detail' in (error.data as any)) {
      return (error.data as any).detail
    }
  } else if ('error' in error) {
    return error.error
  } else if ('status' in error) {
    switch (error.status) {
      case 403:
        return "You don't have permission to perform this action"
      case 404:
        return 'Not found'
      case 500:
        return 'Server error'
      default:
        return `Unknown error (${error.status})`
    }
  }
  return 'Unknown error'
}

export type ErrorBoxProps = BoxProps & {
  error?: FetchBaseQueryError | SerializedError
  retry: () => void
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error, retry, ...props }) => (
  <Box {...props}>
    <Typography component="h2" variant="h4">
      Error
    </Typography>
    <Typography>{getErrorMessage(error)}</Typography>
    <Button onClick={retry}>Retry</Button>
  </Box>
)

export default ErrorBox
