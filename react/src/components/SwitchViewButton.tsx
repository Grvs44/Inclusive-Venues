import React from 'react'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import mapOptions from '../config/mapOptions'
import { toggleShowMap } from '../redux/resultsSlice'
import { State } from '../redux/types'

function SwitchViewButton() {
  const dispatch = useDispatch()
  const map = useSelector((state: State) => state.results.showMap)

  return (
    <Button onClick={() => dispatch(toggleShowMap())} variant="outlined">
      {map ? 'List' : 'Map'}
    </Button>
  )
}

const UnavailableButton = () => (
  <Button
    variant="outlined"
    disabled
    sx={{ cursor: 'not-allowed' }}
    title="Map unavailable"
  >
    Map
  </Button>
)

export default mapOptions.authOptions?.subscriptionKey
  ? SwitchViewButton
  : UnavailableButton
