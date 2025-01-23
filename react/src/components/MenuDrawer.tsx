// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/MenuDrawer.tsx
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import PaymentsIcon from '@mui/icons-material/Payments'
import SavingsIcon from '@mui/icons-material/Savings'
import StoreIcon from '@mui/icons-material/Store'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SwipeableDrawer, {
  SwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer'
import { User } from '../redux/types'
import AccountListItem from './AccountListItem'
import InstallPwaListItem from './InstallPwaListItem'
import ListItemButtonLink from './ListItemButtonLink'

export type MenuDrawerProps = SwipeableDrawerProps & { user: User }

export default function MenuDrawer(props: MenuDrawerProps) {
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <List onClick={props.onClose}>
        <ListItem>
          <ListItemButtonLink to="">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="budget">
            <ListItemIcon>
              <SavingsIcon />
            </ListItemIcon>
            <ListItemText>Budgets</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="payee">
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText>Payees</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="payment">
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText>Payments</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <Divider component="li" />
        <InstallPwaListItem />
        <AccountListItem user={props.user} />
      </List>
    </SwipeableDrawer>
  )
}
