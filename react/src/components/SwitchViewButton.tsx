import React from 'react'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowMap } from '../redux/resultsSlice'
import { State } from '../redux/types'

export default function SwitchViewButton() {
  const dispatch = useDispatch()
  const map = useSelector((state: State) => state.results.showMap)

  return (
    <Button onClick={() => dispatch(toggleShowMap())} variant="outlined">
      {map ? 'List' : 'Map'}
    </Button>
  )
}
