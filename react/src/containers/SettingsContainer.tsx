import React from 'react'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import CoordinatesInput from '../components/CoordinatesInput'
import SetThemeItem from '../components/SetThemeItem'
import SettingsItem from '../components/SettingsItem'
import { to_number } from '../components/utils'
import { setAutoLocation, setDefaultLocation } from '../redux/settingsSlice'
import type { State } from '../redux/types'

export default function SettingsContainer() {
  const dispatch = useDispatch()
  const settings = useSelector((state: State) => state.settings)
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

    dispatch(setDefaultLocation(defaultLocation))
    toast.success('Saved default location')
    setChanged(false)
  }

  return (
    <Container>
      <List>
        <ListSubheader>Appearance</ListSubheader>
        <SetThemeItem />
        <Divider />
        <ListSubheader>Location</ListSubheader>
        <SettingsItem
          checked={settings.autoLocation}
          onChange={(checked) => {
            dispatch(setAutoLocation(checked && 'geolocation' in navigator))
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
            setChanged(checked)
            setShowDefaultLocation(checked)
            if (!checked) dispatch(setDefaultLocation(undefined))
          }}
          primary="Use default location"
          secondary="Set the initial location when you open the app (used if auto-location is off or location cannot be retrieved)"
        >
          {changed ? (
            <Button variant="contained" onClick={onSave}>
              Save
            </Button>
          ) : null}
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
    </Container>
  )
}
