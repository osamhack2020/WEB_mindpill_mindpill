import React from 'react'
import { Switch, Route, RouteProps, Redirect } from 'react-router'

import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageCounsel from './pages/Counsel'
import PageManage from './pages/Manage'
import PageNotFound from './pages/NotFound'

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
    path: '/counsel',
    component: PageCounsel
  },
  {
    path: '/manage',
    component: PageManage
  }
]

export function makeSwitch() {
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
