import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './src/App'
import { Provider } from './src/states'

class Root extends React.Component {
  render() {
    return (
      <Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))
