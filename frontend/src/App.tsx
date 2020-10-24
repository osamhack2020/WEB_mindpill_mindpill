import React, { useEffect, useState } from 'react'
import Layout from './pages/Layout'
import axios from 'axios'
import database from './tempDatabase'
import { Router } from './routes'
import { useTracked } from './states'

export type User = {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

export default function App() {
  const [state, dispatch] = useTracked()
  const [user, setUser] = useState<User | null>(null)
  //const [accessToken, setAccessToken] = useState<string>('')
  //const [showCurrentRoom, setShowCurrentRoom] = useState<number>(0)
  //const [showProfile, setShowProfile] = useState<number>(0)

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
        //setAccessToken(access_token)
        dispatch({ type: 'SET_ACCESS_TOKEN', accessToken: access_token })
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
    <Layout>
      <Router />
    </Layout>
  )
}
