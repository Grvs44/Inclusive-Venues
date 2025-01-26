import { createSlice } from '@reduxjs/toolkit'
import { ResultsState } from './types'

const initialState: ResultsState = {
  map: false,
  // TODO: initial filters
}

export const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setMap: (state, action: { payload: boolean }) => {
      state.map = action.payload
    },
  },
})

export const { setMap } = resultsSlice.actions

export default resultsSlice.reducer
