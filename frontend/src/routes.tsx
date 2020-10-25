import React from 'react'
import {
  RouteProps as ReactRouterRouteProps,
  RouteComponentProps
} from 'react-router'
import { Route, Switch } from 'react-router-dom'

// Pages
import PageHome from './pages/Home'
// import PageJoin from './pages/Join'
// import PageLogin from './pages/Login'
// import PageLogout from './pages/Logout'
// import PageCounselRooms from './pages/CounselRooms'
// import PageFriends from './pages/Friends'
// import PageManage from './pages/Manage'
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
  }
  // {
  //   // DEBUG ONLY
  //   exact: true,
  //   path: '/chattest',
  //   component: PageChatTest
  // },
  // {
  //   path: '/join',
  //   component: PageJoin
  // },
  // {
  //   path: '/login',
  //   component: PageLogin
  // },
  // {
  //   path: '/logout',
  //   component: PageLogout
  // },
  // {
  //   path: '/counselrooms',
  //   component: PageCounselRooms
  // },
  // {
  //   path: '/friends',
  //   component: PageFriends
  // },
  // {
  //   path: '/manage',
  //   component: PageManage
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
