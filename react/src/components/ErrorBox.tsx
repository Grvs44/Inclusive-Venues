import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { ApiError } from '../redux/types'
import { getErrorMessage } from '../redux/utils'

export type ErrorBoxProps = BoxProps & {
  error?: ApiError
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
