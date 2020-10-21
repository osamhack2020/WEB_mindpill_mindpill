import React from 'react'
import { RouteProps } from 'react-router'
import { Redirect, Route, Switch } from 'react-router-dom'
import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageCounselrooms from './pages/Counselrooms'
import PageFriends from './pages/Friends'
import PageManage from './pages/Manage'
import PageNotFound from './pages/NotFound'

export function checkAuthority(authority: number | undefined, passingAuthorities: number[]) {
  if (authority && passingAuthorities.includes(authority)) {
    return true
  }
  return false
}

export function parseAuthority(value: number | null | undefined) {
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

export type User = {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

const routes: RouteProps[] = [
  {
    exact: true,
    path: '/'
  },
  {
    path: '/join'
  },
  {
    path: '/login'
  },
  {
    path: '/counsel'
  },
  {
    path: '/manage'
  }
]

type RouterProps = {
  user: User | null
  changeSub: (id: number) => void
}

export function Router({ user, changeSub }: RouterProps) {
  return (
    <Switch>
      <Route exact path="/" render={() => <PageHome user={user} />} />

      {/**
      {checkAuthority(user?.authority, [3, 5]) && <Route path="/counsel" render={() => <PageCounsel user={user} />} />}
      {checkAuthority(user?.authority, [1, 2, 3, 4]) && <Route path="/manage" render={() => <PageManage user={user} />} />}
      {!user && <Route path="/login" render={() => <PageLogin user={user} />} />}
      {!user && <Route path="/join" render={() => <PageJoin user={user} />} />}
      */}

      <Route path="/login" render={() => <PageLogin user={user} />} />
      <Route path="/join" render={() => <PageJoin user={user} />} />
      <Route path="/counselrooms" render={() => <PageCounselrooms user={user} changeSub={changeSub} />} />
      <Route path="/friends" render={() => <PageFriends user={user} changeSub={changeSub} />} />

      <Route path="/manage" render={() => <PageManage user={user} />} />

      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
