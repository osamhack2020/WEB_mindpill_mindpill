import React, { useState } from 'react'

import Layout from './pages/Layout'
import { makeSwitch } from './routes'
import axios from 'axios'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  function handleLogin(email: string, password: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer`
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

        // accessToken을 localStorage, cookie 등에 저장하지 않는다!
      })
      .catch(error => {
        console.log(error)
      })
  }

  return <Layout isLoggedIn={isLoggedIn}>{makeSwitch()}</Layout>
}
