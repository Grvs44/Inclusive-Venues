import { createTheme } from '@mui/material/styles'

// Material UI theming: https://mui.com/material-ui/customization/theming/
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

export default theme

export const starColours = [
  'darkred',
  'red',
  'orange',
  'yellowgreen',
  'lawngreen',
]
