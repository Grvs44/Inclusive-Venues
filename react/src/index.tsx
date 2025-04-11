import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import FilterProvider from './providers/FilterProvider'
import store from './redux/store'
import router from './router'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FilterProvider>
        <RouterProvider router={router} />
      </FilterProvider>
    </ThemeProvider>
  </Provider>,
)
