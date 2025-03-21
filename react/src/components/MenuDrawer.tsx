// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/MenuDrawer.tsx
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import PlaceIcon from '@mui/icons-material/Place'
import SettingsIcon from '@mui/icons-material/Settings'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SwipeableDrawer, {
  SwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer'
import { User } from '../redux/types'
import AccountListItem from './AccountListItem'
import InstallPwaListItem from './InstallPwaListItem'
import LinkListItem from './LinkListItem'

export type MenuDrawerProps = SwipeableDrawerProps & {
  user?: User
}

export default function MenuDrawer({ user, ...props }: MenuDrawerProps) {
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <List
        onClick={props.onClose}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <LinkListItem to="">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </LinkListItem>
        <LinkListItem to="venue">
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText>Venues</ListItemText>
        </LinkListItem>
        <LinkListItem to="review">
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText>My reviews</ListItemText>
        </LinkListItem>
        <div style={{ marginTop: 'auto' }}>
          <Divider component="li" />
          <InstallPwaListItem />
          <AccountListItem user={user} />
          <LinkListItem to="settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </LinkListItem>
        </div>
      </List>
    </SwipeableDrawer>
  )
}
