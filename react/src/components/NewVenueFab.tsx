import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'

export type NewVenueFabProps = {
  onClick: () => void
}

const NewVenueFab: React.FC<NewVenueFabProps> = ({ onClick }) => (
  <Fab
    // Fab adapted from https://mui.com/material-ui/react-floating-action-button/
    color="primary"
    onClick={onClick}
    variant="extended"
    sx={{ position: 'fixed', right: 16, bottom: 16 }}
  >
    <AddIcon sx={{ mr: 1 }} />
    New venue
  </Fab>
)

export default NewVenueFab
