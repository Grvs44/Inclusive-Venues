import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

export type CloseButtonProps = {
  onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = (props) => (
  <IconButton
    // Adapted from https://mui.com/material-ui/react-dialog/#customization
    aria-label="close"
    onClick={props.onClick}
    sx={(theme) => ({
      position: 'absolute',
      right: 8,
      top: 8,
      color: theme.palette.grey[500],
    })}
  >
    <CloseIcon />
  </IconButton>
)

export default CloseButton
