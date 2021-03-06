// Imports
import { Server } from 'http'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// UI Imports
import { createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'

// App Imports
import { APP_URL, NODE_ENV, GA_TRACKING_ID } from '../config/env'
import params from '../config/params'
import { rootReducer } from '../store'
import routes from '../routes'
import { setUser } from '../../modules/user/api/actions/mutation'
import App from '../client/App'
import view from './view'

export default function (app) {
  console.info('SETUP - Load routes..')

  // Store (new store for each request)
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  )

  // Match any Route
  app.get('*', (request, response) => {

    // Check for auth
    if (request.cookies.auth) {
      const auth = JSON.parse(request.cookies.auth)

      if (auth && auth.token !== '' && auth.user) {
        store.dispatch(setUser(auth.token, auth.user))
      }
    }

    // HTTP status code
    let status = 200

    const matches = Object.values(routes).reduce((matches, route) => {
      const match = matchPath(request.url, typeof route.path === 'function' ? route.path() : route.path, route)

      if (match && match.isExact) {
        matches.push({
          route,
          match,
          promise: route.component.fetchData ? route.component.fetchData({
            store,
            params: match.params
          }) : Promise.resolve(null)
        })
      }
      return matches
    }, [])

    // No such route, send 404 status
    if (matches.length === 0) {
      status = 404
    }

    // Any AJAX calls inside components
    const promises = matches.map((match) => {
      return match.promise
    })

    // Resolve the AJAX calls and render
    Promise.all(promises)
      .then((...data) => {
        const initialState = store.getState()
        const context = {}

        if (context.url) {
          response.redirect(context.url)
        } else {
          const sheetsRegistry = new SheetsRegistry()
          const generateClassName = createGenerateClassName()

          const html = renderToString(
            <Provider store={store} key={'provider'}>
              <StaticRouter context={context} location={request.url}>
                <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                  <App/>
                </JssProvider>
              </StaticRouter>
            </Provider>
          )

          // Get styles
          const css = sheetsRegistry.toString()

          // Get Meta header tags
          const meta = Helmet.renderStatic()

          const markup = view({ APP_URL, NODE_ENV, GA_TRACKING_ID }, params, { meta, html, css, initialState })

          // Reset the state on server
          store.dispatch({
            type: 'RESET'
          })

          // Finally send generated HTML with initial data to the project
          return response.status(status).send(markup)
        }
      })
      .catch(error => {
        console.error(error)
      })
  })
}
