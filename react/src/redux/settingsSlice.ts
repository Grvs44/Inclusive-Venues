import { createSlice } from '@reduxjs/toolkit'
import type { SettingsState } from './types'

const initialState: SettingsState = {
  autoLocation: false,
  ...(() => {
    const saved = localStorage.getItem('inclusivevenues')
    return saved ? JSON.parse(saved) : null
  })(),
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, { payload }: { payload: SettingsState }) {
      state = payload
      localStorage.setItem('inclusivevenues', JSON.stringify(payload))
    },
  },
})

export default settingsSlice.reducer
export const { updateSettings } = settingsSlice.actions
