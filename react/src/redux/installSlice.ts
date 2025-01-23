// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/installSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { InstallState } from './types'

const initialState: InstallState = {
  show: false,
  deferredPrompt: null,
}

export const installSlice = createSlice({
  name: 'install',
  initialState,
  reducers: {
    setShow(state, action: { payload: boolean }) {
      state.show = action.payload
    },
    setDeferredPrompt(state, action) {
      state.deferredPrompt = action.payload
    },
  },
})

export const { setShow, setDeferredPrompt } = installSlice.actions
export default installSlice.reducer
