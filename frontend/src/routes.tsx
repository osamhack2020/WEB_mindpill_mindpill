import React from 'react'
import { RouteProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageCounselRooms from './pages/CounselRooms'
import PageFriends from './pages/Friends'
import ChatTestPage from './pages/ChatTest'
import PageManage from './pages/Manage'
import PageNotFound from './pages/NotFound'
import { GlobalData, User } from './App'

export function checkAuthority(
  authority: number | undefined,
  passingAuthorities: number[]
) {
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
  },
  {
    path: '/chattest'
  }
]

type RouterProps = {
  globalData: GlobalData
}

export function Router({ globalData }: RouterProps) {
  return (
    <Switch>
      <Route exact path="/" render={() => <PageHome globalData={globalData} />} />
      <Route exact path="/chattest" render={() => <ChatTestPage />} />
        
      {/**
      {checkAuthority(user?.authority, [3, 5]) && <Route path="/counsel" render={() => <PageCounsel user={user} />} />}
      {checkAuthority(user?.authority, [1, 2, 3, 4]) && <Route path="/manage" render={() => <PageManage user={user} />} />}
      {!user && <Route path="/login" render={() => <PageLogin user={user} />} />}
      {!user && <Route path="/join" render={() => <PageJoin user={user} />} />}
      */}

      <Route path="/login" render={() => <PageLogin globalData={globalData} />} />
      <Route path="/join" render={() => <PageJoin globalData={globalData} />} />
      <Route path="/counselrooms" render={() => <PageCounselRooms globalData={globalData} />} />
      <Route path="/friends" render={() => <PageFriends globalData={globalData} />} />

      <Route path="/manage" render={() => <PageManage globalData={globalData} />} />

      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
