import React, { useEffect, useState } from 'react'
import Layout from './pages/Layout'
import axios from 'axios'
import database from './tempDatabase'
import { Router } from './routes'

export type GlobalData = {
  user: User | null
  showSub: number
  accessToken: string
  changeSub: (id: number) => void
  handleLogin: (email: string, password: string) => void
}

export type User = {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showSub, setShowSub] = useState<number>(0)
  const [accessToken, setAccessToken] = useState<string>('')

  const globalData = {
    user,
    showSub,
    changeSub,
    handleLogin,
    accessToken
  }

  function changeSub(id: number) {
    setShowSub(id)
  }

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
        setAccessToken(access_token)
        localStorage.setItem('refreshToken', refresh_token)
        console.log({ access_token, refresh_token })
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleLogout() {}

  function refreshAccessToken(refresh_token: string) {
    axios({
      method: 'post',
      url: '/api/create_token',
      params: {
        request_type: 'refresh'
      },
      data: {
        refresh_token
      }
    })
      .then(response => {
        const { access_token, refresh_token } = response.data
        setAccessToken(access_token)
        //암호화 해야합니다.
        localStorage.setItem('refreshToken', refresh_token)
        console.log({ access_token, refresh_token })
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

  useEffect(() => {
    //암호화 해야합니다.
    console.log(localStorage.getItem('refreshToken'))
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      refreshAccessToken(refreshToken)
    }
  }, [])

  return (
    <Layout changeUser={authenticateUser} globalData={globalData}>
      <Router globalData={globalData} />
    </Layout>
  )
}
