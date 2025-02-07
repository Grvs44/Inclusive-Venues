import { createSlice } from '@reduxjs/toolkit'
import { ResultsState } from './types'

const initialState: ResultsState = {
  showMap: false,
  page: 1,
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
    setPage(state, action: { payload: number }) {
      state.page = action.payload
    },
    incrementPage(state) {
      state.page++
    },
  },
})

export const { setShowMap, toggleShowMap, setPage, incrementPage } =
  resultsSlice.actions

export default resultsSlice.reducer
