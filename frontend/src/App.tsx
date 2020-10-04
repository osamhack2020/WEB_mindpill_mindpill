import React from 'react'

import Layout from './pages/Layout'
import { makeSwitch } from './routes'

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
    return <Layout isLoggedIn={this.state.isLoggedIn}>{makeSwitch()}</Layout>
  }
}
