// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/installSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { PwaState } from './types'

const initialState: PwaState = {
  show: false,
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
  },
})

export const { setShow, setDeferredPrompt } = pwaSlice.actions
export default pwaSlice.reducer
