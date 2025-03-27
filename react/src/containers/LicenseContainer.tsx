import React from 'react'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { useGetLicenseQuery } from '../redux/apiSlice'

export default function LicenseContainer() {
  const [open, setOpen] = React.useState<boolean>(false)
  const { data, isFetching } = useGetLicenseQuery(undefined, { skip: !open })

  return open ? (
    isFetching ? (
      <Skeleton width="100%" />
    ) : (
      <textarea
        value={data || "Couldn't retrieve license info"}
        style={{ height: 200, width: '100%' }}
        readOnly
      />
    )
  ) : (
    <Button onClick={() => setOpen(true)}>View licenses</Button>
  )
}
