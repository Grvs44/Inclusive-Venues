import React from 'react'
import SaveIcon from '@mui/icons-material/Save'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import FormGroup from '@mui/material/FormGroup'
import List from '@mui/material/List'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import CoordinatesInput from '../components/CoordinatesInput'
import SettingsItem from '../components/SettingsItem'
import { to_number } from '../components/utils'
import { updateSettings } from '../redux/settingsSlice'
import type { SettingsState, State } from '../redux/types'

export default function SettingsContainer() {
  const dispatch = useDispatch()
  const settings = useSelector((state: State) => state.settings)
  const [autoLocation, setAutoLocation] = React.useState<boolean>(
    settings.autoLocation,
  )
  const [showDefaultLocation, setShowDefaultLocation] = React.useState<boolean>(
    settings.defaultLocation != undefined,
  )
  const [defaultLatitude, setDefaultLatitude] = React.useState<string>(
    settings.defaultLocation?.[0].toString() || '',
  )
  const [defaultLongitude, setDefaultLongitude] = React.useState<string>(
    settings.defaultLocation?.[1].toString() || '',
  )
  const [changed, setChanged] = React.useState<boolean>(false)

  const onSave = () => {
    let defaultLocation: [number, number] | undefined
    if (showDefaultLocation) {
      const latitudeValue = to_number(defaultLatitude)
      const longitudeValue = to_number(defaultLongitude)
      if (isNaN(latitudeValue) || isNaN(longitudeValue)) {
        toast.error('Coordinates must be valid numbers')
        return
      }
      defaultLocation = [latitudeValue, longitudeValue]
    } else {
      defaultLocation = undefined
    }

    const newSettings: SettingsState = { autoLocation, defaultLocation }
    dispatch(updateSettings(newSettings))
    toast.success('Saved settings')
    setChanged(false)
  }

  return (
    <Container>
      <FormGroup>
        <List>
          <SettingsItem
            checked={autoLocation}
            onChange={(checked) => {
              setChanged(true)
              setAutoLocation(checked && 'geolocation' in navigator)
            }}
            primary="Auto-detect location"
            secondary={
              'geolocation' in navigator
                ? 'Auto-detect your location when you open the app'
                : "Your device doesn't support location"
            }
            disabled={!('geolocation' in navigator)}
          />
          <Divider variant="middle" />
          <SettingsItem
            checked={showDefaultLocation}
            onChange={(checked) => {
              setChanged(true)
              setShowDefaultLocation(checked)
            }}
            primary="Use default location"
            secondary="Set the initial location when you open the app (used if auto-location is off or location cannot be retrieved)"
          >
            <CoordinatesInput
              latitude={defaultLatitude}
              longitude={defaultLongitude}
              setLatitude={(checked) => {
                setChanged(true)
                setDefaultLatitude(checked)
              }}
              setLongitude={(checked) => {
                setChanged(true)
                setDefaultLongitude(checked)
              }}
            />
          </SettingsItem>
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
