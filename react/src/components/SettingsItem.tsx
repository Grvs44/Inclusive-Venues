import React from 'react'
import { FormControlLabel, ListItem, ListItemText, Switch } from '@mui/material'

export type SettingsItemProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  primary: string
  secondary: string
}

export default function SettingsItem(props: SettingsItemProps) {
  return (
    <ListItem>
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
    </ListItem>
  )
}
