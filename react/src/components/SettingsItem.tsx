import React from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Switch from '@mui/material/Switch'

export type SettingsItemProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  primary: string
  secondary: string
  children?: React.ReactNode
}

export default function SettingsItem(props: SettingsItemProps) {
  return (
    <ListItem>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={props.checked}
              onChange={(event) => props.onChange(event.target.checked)}
            />
          }
          label={
            <ListItemText primary={props.primary} secondary={props.secondary} />
          }
        />
        {props.checked ? props.children : undefined}
      </Box>
    </ListItem>
  )
}
