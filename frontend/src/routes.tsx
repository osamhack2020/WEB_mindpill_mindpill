import React from 'react'
import { RouteProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageCounselRooms from './pages/CounselRooms'
import PageFriends from './pages/Friends'
import PageManage from './pages/Manage'
import PageNotFound from './pages/NotFound'

export function checkAuthority(authority: number | undefined, passingAuthorities: number[]) {
  if (authority && passingAuthorities.includes(authority)) {
    return true
  }
  return false
}

const routes: RouteProps[] = [
  {
    exact: true,
    path: '/',
    component: PageHome
  },
  {
    path: '/join',
    component: PageJoin
  },
  {
    path: '/login',
    component: PageLogin
  },
  {
    path: '/counselrooms',
    component: PageCounselRooms
  },
  {
    path: '/friends',
    component: PageFriends
  },
  {
    path: '/manage',
    component: PageManage
  }
]

export function Router() {
  return (
    <Switch>
      {routes.map(props => (
        <Route key={props.location ? props.location.pathname : '__notfound__'} {...props} />
      ))}
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
