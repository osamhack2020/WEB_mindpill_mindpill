import React from 'react'

import Layout from './pages/Layout'
import { makeSwitch } from './routes'
import axios from 'axios'

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

  handleLogin = (email: string, password: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer`
    axios({
      method: 'post',
      url: '/api/create_token',
      params: {
        request_type: 'password'
      },
      data: {
        email,
        password
      }
    })
      .then(response => {
        const { access_token, refresh_token } = response.data

        // accessToken을 localStorage, cookie 등에 저장하지 않는다!
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return <Layout isLoggedIn={this.state.isLoggedIn}>{makeSwitch()}</Layout>
  }
}
