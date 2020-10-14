import React, { useEffect, useState } from 'react'

import Layout from './pages/Layout'
import axios from 'axios'
import database from './tempDatabase'
import { Route, Switch } from 'react-router-dom'

import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageCounsel from './pages/Counsel'
import PageManage from './pages/Manage'
import PageNotFound from './pages/NotFound'

export type User = {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

export function parseAuthority(value: number) {
  switch (value) {
    case 1:
      return '서비스관리자'
    case 2:
      return '부대관리자'
    case 3:
      return '상담관'
    case 4:
      return '지휘관'
    case 5:
      return '일반사용자'
    default:
      return '로그인 정보 없음'
  }
}

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

  useEffect(() => {
    authenticateUser(6)
  }, [])

  return (
    <Layout user={user} changeUser={authenticateUser}>
      <Switch>
        <Route exact path="/" render={() => <PageHome user={user} />} />
        <Route path="/counsel" render={() => <PageCounsel user={user} />} />
        <Route path="/login" render={() => <PageLogin user={user} />} />
        <Route path="/join" render={() => <PageJoin user={user} />} />
        <Route path="/manage" render={() => <PageManage user={user} />} />
        <Route render={() => <PageNotFound user={user} />} />
      </Switch>
    </Layout>
  )
}
