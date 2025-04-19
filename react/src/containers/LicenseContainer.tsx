import React from 'react'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import ErrorBox from '../components/ErrorBox'
import { useGetLicenseQuery } from '../redux/licenseSlice'

export default function LicenseContainer() {
  const [open, setOpen] = React.useState<boolean>(false)
  const { data, error, isError, isFetching, refetch } = useGetLicenseQuery(
    undefined,
    { skip: !open },
  )

  return open ? (
    isFetching ? (
      <Skeleton width="100%" />
    ) : isError ? (
      <ErrorBox error={error} retry={refetch} sx={{ marginTop: '1em' }} />
    ) : (
      <textarea
        value={data}
        style={{
          height: 200,
          width: '100%',
          marginTop: '1em',
          resize: 'vertical',
        }}
        readOnly
      />
    )
  ) : (
    <Button onClick={() => setOpen(true)}>View licenses</Button>
  )
}
