import React, { useEffect, useState } from 'react'
import Layout from './pages/Layout'
import axios from 'axios'
import database from './tempDatabase'
import { Router, User } from './routes'

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  function handleLogin(email: string, password: string) {
    // 초기 access token 과 refresh token 을 받는 곳입니다.
    axios({
      method: 'post',
      url: '/api/create_token',
      params: {
        request_type: 'password'
      },
      data: {
        email,
        password
      }
    })
      .then(response => {
        const { access_token, refresh_token } = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }

  function authenticateUser(value: number) {
    //refresh token 을 다룰 곳입니다.
    console.log('authenticate', value)
    const user = database.API_AUTHENTICATE_USER[value - 1]
    setUser(user)
  }

  useEffect(() => {}, [])

  return (
    <Layout user={user} changeUser={authenticateUser}>
      <Router user={user} />
    </Layout>
  )
}
