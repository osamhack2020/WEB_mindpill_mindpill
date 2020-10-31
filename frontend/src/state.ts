import { useReducer, Reducer } from 'react'
import { createContainer } from 'react-tracked'

import User from './types/user'
import Token from './types/token'

export interface State {
  token?: Token
  user?: User
}

export const initialState: State = {}

export type Action =
  | { type: 'SET_TOKEN'; token: Token }
  | { type: 'SET_USER'; user: User }
  | { type: 'LOGOUT' }

const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...prevState,
        token: action.token
      }
    case 'SET_USER':
      return {
        ...prevState,
        user: action.user
      }
    case 'LOGOUT':
      return {
        ...prevState,
        token: undefined,
        user: undefined
      }
    default:
      throw new Error('unknown action type')
  }
}

export const {
  Provider,
  useTrackedState,
  useTracked,
  useUpdate,
  useSelector
} = createContainer(() => useReducer(reducer, initialState))
