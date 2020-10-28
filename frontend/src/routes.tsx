import React from 'react'
import {
  RouteProps as ReactRouterRouteProps,
  RouteComponentProps
} from 'react-router'
import { Route, Switch } from 'react-router-dom'

// Pages
import PageHome from './pages/HomePage'
import LoginPage from './pages/user/LoginPage'
import GroupPage from './pages/GroupPage'
import PageNotFound from './pages/NotFound'
// import PageChatTest from './pages/ChatTest'

type RouteProps = ReactRouterRouteProps & {
  path: string
  component: React.ComponentType<RouteComponentProps<any>>
}

const routes: Array<RouteProps> = [
  {
    exact: true,
    path: '/',
    component: PageHome
  },
  {
    exact: true,
    path: '/user/login',
    component: LoginPage
  },
  {
    path: '/group/:id',
    component: GroupPage
  }
  // {
  //   // DEBUG ONLY
  //   exact: true,
  //   path: '/chattest',
  //   component: PageChatTest
  // }
]

export function Router() {
  return (
    <Switch>
      {routes.map(route => (
        <Route key={route.path} {...route} />
      ))}
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default routes
