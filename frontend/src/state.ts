import { useReducer, Reducer } from 'react'
import { createContainer } from 'react-tracked'

const initialState = {
  accessToken: '',
  user: '',
  currentRoomId: 0,
  profileId: 0
}

type State = typeof initialState

type Action =
  | { type: 'SET_ACCESS_TOKEN'; accessToken: string }
  | { type: 'SET_CURRENT_ROOM_ID'; currentRoomId: number }
  | { type: 'SET_PROFILE_ID'; profileId: number }
  | { type: 'SET_USER'; user: string } //타입이 변경될 수 있습니다.

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.accessToken
      }
    case 'SET_CURRENT_ROOM_ID':
      return {
        ...state,
        currentRoomId: action.currentRoomId
      }
    case 'SET_PROFILE_ID':
      return {
        ...state,
        profileId: action.profileId
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.user
      }
    default:
      throw new Error('unknown action type')
  }
}

const useValue = () => useReducer(reducer, initialState)

export const { Provider, useTracked } = createContainer(useValue)
