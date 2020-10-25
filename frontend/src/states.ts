import { useReducer, Reducer } from 'react'
import { createContainer } from 'react-tracked'
import { Auth as AuthType } from './types'

export const initialState = {
  accessToken: '',
  user: {
    admin: false,
    id: 0,
    groups: [],
    created_at: '',
    email: '',
    gender: null,
    name: '',
    phone_number: '',
    updated_at: '',
    auth: null
  },
  currentRoomId: 0,
  profileId: 0,
  subPage: null
}

type Gender = 'm' | 'f' | null

type Group = {
  id: number
  manager: boolean
  counselor: boolean
}

type User = {
  admin: boolean
  id: number
  groups: Group[]
  created_at: string
  email: string
  gender: Gender
  name: string
  phone_number: string
  updated_at: string
  auth: AuthType 
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
