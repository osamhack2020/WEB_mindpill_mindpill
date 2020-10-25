import React from 'react'
import { RouteProps } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import { useTracked } from './states'
import { Auth as AuthType } from './types'

//pages
import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageLogout from './pages/Logout'
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

type AuthRoute = {
  auth: AuthType[]
}

const routes: Array<RouteProps & AuthRoute> = [
  {
    exact: true,
    path: '/',
    component: PageHome,
    auth: ['admin', 'manager', 'counselor', 'commander', 'user', null]
  },
  {
    path: '/join',
    component: PageJoin,
    auth: [null]
  },
  {
    path: '/login',
    component: PageLogin,
    auth: [null]
  },
  {
    path: '/logout',
    component: PageLogout,
    auth: ['admin', 'manager', 'counselor', 'commander', 'user']
  },
  {
    path: '/counselrooms',
    component: PageCounselRooms,
    auth: ['counselor', 'user']
  },
  {
    path: '/friends',
    component: PageFriends,
    auth: ['counselor', 'user']
  },
  {
    path: '/manage',
    component: PageManage,
    auth: ['admin', 'manager', 'commander']
  }
]

function AuthRoute() {}

export function Router() {
  const [state, dispatch] = useTracked()

  return (
    <Switch>
      {routes.map(props => {
        if (props.auth.includes(state.user.auth)) {
          return <Route key={props.location ? props.location.pathname : '__notfound__'} {...props} />
        }
        return <Redirect path={props.path} to="/" key={props.location ? props.location.pathname : '__notfound__'} />
      })}
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
