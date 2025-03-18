import React from 'react'
import Skeleton from '@mui/material/Skeleton'

export default function LoadingSkeleton({ isFetching }: { isFetching: boolean }) {
  return isFetching ? (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  ) : null
}
