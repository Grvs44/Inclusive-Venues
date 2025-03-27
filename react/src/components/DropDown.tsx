// From https://mui.com/material-ui/react-autocomplete
// and https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/DropDown.jsx
import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { Entity } from '../redux/types'

export type DropDownProps<T extends Entity> = {
  defaultValue?: T | null
  value?: T | null
  label: string
  required?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onChange: (value: T | null) => void
  getLabel: (value: T) => string
  data: T[]
  isFetching: boolean
}

export default function DropDown<T extends Entity>(props: DropDownProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [currentData, setCurrentData] = React.useState<T[]>([])
  const loading = open && props.isFetching

  React.useEffect(() => {
    if (input == '') {
      setCurrentData(props.data)
    } else {
      const lower = input.toLowerCase()
      setCurrentData(
        props.data.filter((x) =>
          props.getLabel(x).toLowerCase().includes(lower),
        ),
      )
    }
  }, [input])

  React.useEffect(() => setCurrentData(props.data), [props.data])

  return (
    <Autocomplete
      filterOptions={(x) => x}
      defaultValue={props.defaultValue}
      value={props.value}
      disabled={props.disabled}
      fullWidth={props.fullWidth}
      sx={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => props.getLabel(option)}
      onChange={(event, value) => props.onChange(value)}
      onInputChange={(event, value) => setInput(value)}
      options={currentData}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          required={props.required}
          value={input}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  )
}
