import { createSlice } from '@reduxjs/toolkit'
import { ResultsState } from './types'

const initialState: ResultsState = {
  showMap: false,
  // TODO: initial filters
}

export const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setShowMap(state, action: { payload: boolean }) {
      state.showMap = action.payload
    },
    toggleShowMap(state) {
      state.showMap = !state.showMap
    },
  },
})

export const { setShowMap, toggleShowMap } = resultsSlice.actions

export default resultsSlice.reducer
