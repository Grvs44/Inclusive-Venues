import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import MenuDrawer from '../components/MenuDrawer'
import TitleBar from '../components/TitleBar'
import { useGetUserDetailsQuery } from '../redux/apiSlice'
import { State } from '../redux/types'

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/containers/TopBar.jsx
export default function TopBar() {
  const user = useGetUserDetailsQuery()
  const { title } = useSelector((state: State) => state.title)
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <AppBar position="sticky">
        <TitleBar />
        <Toolbar>
          <IconButton
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <MenuDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        user={user}
      />
    </>
  )
}
