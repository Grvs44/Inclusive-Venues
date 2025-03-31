import React from 'react'
import SaveIcon from '@mui/icons-material/Save'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import FormGroup from '@mui/material/FormGroup'
import List from '@mui/material/List'
import { useDispatch, useSelector } from 'react-redux'
import SettingsItem from '../components/SettingsItem'
import { updateSettings } from '../redux/settingsSlice'
import type { SettingsState, State } from '../redux/types'
import toast from 'react-hot-toast'

export default function SettingsContainer() {
  const dispatch = useDispatch()
  const [settings, setSettings] = React.useState<SettingsState>(
    useSelector((state: State) => state.settings),
  )
  const [changed, setChanged] = React.useState<boolean>(false)

  const changeSetting = (change: Partial<SettingsState>) => {
    setChanged(true)
    setSettings((settings) => ({ ...settings, ...change }))
  }

  const onSave = () => {
    dispatch(updateSettings(settings))
    toast.success('Saved settings')
    setChanged(false)
  }

  return (
    <Container>
      <FormGroup>
        <List>
          <SettingsItem
            checked={settings.autoLocation}
            onChange={(autoLocation) => changeSetting({ autoLocation })}
            primary="Auto-detect location"
            secondary="Auto-detect your location when you open the app"
          />
          <Divider variant="middle" />
          <SettingsItem
            checked={settings.defaultLocation != undefined}
            onChange={(checked) =>
              changeSetting({
                defaultLocation: checked ? [0, 0] : undefined,
              })
            }
            primary="Use default location"
            secondary="Set the initial location when you open the app (used if auto-location is off or location cannot be retrieved)"
          />
        </List>
      </FormGroup>
      {changed ? (
        <Fab
          // Fab adapted from https://mui.com/material-ui/react-floating-action-button/
          color="primary"
          onClick={onSave}
          variant="extended"
          sx={{ position: 'fixed', right: 16, bottom: 16 }}
        >
          <SaveIcon sx={{ mr: 1 }} />
          Save
        </Fab>
      ) : null}
    </Container>
  )
}
