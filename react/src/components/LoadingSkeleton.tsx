import React from 'react'
import Skeleton from '@mui/material/Skeleton'

export default function LoadingSkeleton({ isLoading }: { isLoading: boolean }) {
  return isLoading ? (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  ) : null
}
