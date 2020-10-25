import { useReducer, Reducer } from 'react'
import { createContainer } from 'react-tracked'

const initialState = {
  accessToken: '',
  user: {},
  currentRoomId: 0,
  profileId: 0,
  subPage: null
}

type User = {
  admin?: boolean
  id?: number
  groups?: [
    {
      id: number
      manager: boolean
      counselor: boolean
    }
  ]
  created_at?: string
  email?: string
  gender?: 'm' | 'f'
  name?: string
  phone_number?: string
  updated_at?: string
}

type State = {
  accessToken: string
  user: User
  currentRoomId: number
  profileId: number
  subPage: 'COUNSEL_ROOM' | 'MANAGE' | null
}

type Action =
  | { type: 'SET_ACCESS_TOKEN'; accessToken: string }
  | { type: 'SET_CURRENT_ROOM_ID'; currentRoomId: number }
  | { type: 'SET_PROFILE_ID'; profileId: number }
  | { type: 'SET_USER'; user: User } //타입이 변경될 수 있습니다.
  | { type: 'SET_SUB_PAGE'; subPage: 'COUNSEL_ROOM' | 'MANAGE' | null } //타입이 변경될 수 있습니다.

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
    case 'SET_SUB_PAGE':
      return {
        ...state,
        subPage: action.subPage
      }
    default:
      throw new Error('unknown action type')
  }
}

const useValue = () => useReducer(reducer, initialState)

export const { Provider, useTracked } = createContainer(useValue)
