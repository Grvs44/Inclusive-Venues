import React from 'react'
import {
  useGetUserDetailsQuery,
  useLoginMutation,
  useLogoutMutation,
} from './redux/apiSlice'

export default function App() {
  const { data, isLoading } = useGetUserDetailsQuery()
  const [login] = useLoginMutation()
  const [logout] = useLogoutMutation()
  const loginTest = () => login({ username: 'admin', password: 'admin' })
  console.log(data)
  return isLoading ? (
    <p>Loading...</p>
  ) : data ? (
    <p>
      {data?.username} <button onClick={() => logout()}>Logout</button>
    </p>
  ) : (
    <button onClick={loginTest}>Login</button>
  )
}
