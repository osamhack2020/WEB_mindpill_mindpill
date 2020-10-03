import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import Join from './pages/Join'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Layout from './pages/Layout'

interface AppState {
  isLoggedIn: boolean
}

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoggedIn: true
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Layout isLoggedIn={this.state.isLoggedIn}>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/join" component={Join} />
            <Route path="/chat" component={Chat} />
          </Layout>
        </Switch>
      </BrowserRouter>
    )
  }
}
