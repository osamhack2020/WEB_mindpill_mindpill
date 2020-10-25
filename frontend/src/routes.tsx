import React from 'react'
import { Redirect, RouteProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { useTracked } from './states'

//pages
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

type Auth = 'admin' | 'manager' | 'counselor' | 'commander' | 'user' | null

type AuthRoute = {
  auth: Auth[]
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

  function getUserAuth() {
    let userAuth: Auth = null
    if (state.user) {
      userAuth = 'user'
      if (state.user.admin) {
        userAuth = 'admin'
      } else if (state.user.groups) {
        if (state.user.groups[0].manager) {
          userAuth = 'manager'
        } else if (state.user.groups[0].counselor) {
          userAuth = 'counselor'
        }
      }
    }
    //'commander' 에대한 정보를 확인할 수 없습니다.
    return userAuth
  }

  return (
    <Switch>
      {routes.map(props => {
        if (props.auth.includes(getUserAuth())) {
          return <Route key={props.location ? props.location.pathname : '__notfound__'} {...props} />
        }
        return <Redirect path={props.path} to="/" key={props.location ? props.location.pathname : '__notfound__'} />
      })}
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
