// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/installSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { PwaState } from './types'

const initialState: PwaState = {
  show: false,
  offline: false,
}

export const pwaSlice = createSlice({
  name: 'pwa',
  initialState,
  reducers: {
    setShow(state, action: { payload: boolean }) {
      state.show = action.payload
    },
    setDeferredPrompt(state, action: { payload: Event | null }) {
      state.deferredPrompt = action.payload
    },
    setOnline(state) {
      state.offline = false
    },
    setOffline(state) {
      state.offline = true
    },
  },
})

export const { setShow, setDeferredPrompt, setOnline, setOffline } =
  pwaSlice.actions
export default pwaSlice.reducer
