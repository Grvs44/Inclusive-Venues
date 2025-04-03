import { createSlice } from '@reduxjs/toolkit'
import type { SettingsState } from './types'

const initialState: SettingsState = {
  autoLocation: false,
  ...(() => {
    const saved = localStorage.getItem('inclusivevenues')
    return saved ? JSON.parse(saved) : null
  })(),
}

const saveState = (state: SettingsState) =>
  localStorage.setItem('inclusivevenues', JSON.stringify(state))

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAutoLocation(state, action: { payload: boolean }) {
      state.autoLocation = action.payload
      saveState(state)
    },
    setDefaultLocation(
      state,
      action: { payload: SettingsState['defaultLocation'] },
    ) {
      state.defaultLocation = action.payload
      saveState(state)
    },
  },
})

export default settingsSlice.reducer
export const { setAutoLocation, setDefaultLocation } = settingsSlice.actions
