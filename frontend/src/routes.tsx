import React from 'react'
import { Switch, Route, RouteProps, Redirect } from 'react-router'

import PageHome from './pages/Home'
import PageJoin from './pages/Join'
import PageLogin from './pages/Login'
import PageChat from './pages/Chat'
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
    path: '/chat',
    component: PageChat
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
