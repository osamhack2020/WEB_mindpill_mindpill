import React from 'react'
import ReactDOM from 'react-dom/server'
import { matchPath, StaticRouter } from 'react-router'
import routes from './src/routes'
import App from './src/App'

import { Provider } from './src/states'

interface SSRRootProps {
  requestPath: string
}

class SSRRoot extends React.Component<SSRRootProps> {
  render() {
    return (
      <Provider>
        <StaticRouter location={this.props.requestPath}>
          <App />
        </StaticRouter>
      </Provider>
    )
  }
}

function routeExists(p: string): boolean {
  for (let route of routes) {
    const match = matchPath(p, route)
    if (match != null) {
      return true
    }
  }
  return false
}

function main() {
  const argv = process.argv
  if (argv.length > 3) {
    console.error(`usage: node ${argv[1]} path`)
    process.exit(1)
  }
  const requestPath = argv.length === 3 ? argv[2] : '/'
  const status = routeExists(requestPath) ? 200 : 404
  const markup = ReactDOM.renderToString(<SSRRoot requestPath={requestPath} />)
  const result: { status: number; markup: string } = { status, markup }
  console.log(JSON.stringify(result))
}

;(() => {
  main()
})()
