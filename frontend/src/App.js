import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './assets/css/styles.css'


// pages
import Home from './pages/Home';
import Join from './pages/Join';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Layout from './pages/Layout';

class App extends React.Component {
  state = {
    isLoggedIn: true,
  }
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Layout isLoggedIn={this.state.isLoggedIn}>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/join' component={Join} />
            <Route path='/chat' component={Chat} />
          </Layout>
          
        </Switch>
      </BrowserRouter>
    )
  }
  
}

export default App
