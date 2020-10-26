import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { AsyncDispatch, useAsyncReducer } from './hooks/async'
import { Router } from './routes'
import { useTracked } from './state'
import { DescribeTokenResponse } from './types/api/describe_token'
import TokenGroup from './types/group'
import User from './types/user'
import { get } from './utils/http'

async function describeToken(token: string, dispatch: AsyncDispatch<User>) {
  const response = await get<DescribeTokenResponse>('/api/describe_token', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
    return
  }

  const { data } = response
  const groups = data.groups.map<TokenGroup>(group => ({
    id: group.id,
    isManager: group.manager,
    isCounselor: group.counselor
  }))
  const user: User = {
    id: data.uid,
    isAdmin: data.admin,
    groups: groups,
    email: data.email,
    name: data.name
  }

  dispatch({ type: 'SUCCESS', data: user })
}

export default function App() {
  const [state, dispatch] = useTracked()
  const [userState, userDispatch] = useAsyncReducer<User>()

  useEffect(() => {
    const { token } = state
    if (token == null) {
      return
    }
    describeToken(token.access, userDispatch)
  }, [state])

  useEffect(() => {
    if (userState.data != null) {
      dispatch({
        type: 'SET_USER',
        user: userState.data
      })
    }
  }, [userState])

  useEffect(() => {
    const accessToken = Cookies.get('MINDPILL_TOKEN')
    const refreshToken = Cookies.get('MINDPILL_REFRESH_TOKEN')
    if (accessToken == null || refreshToken == null) {
      return
    }

    dispatch({
      type: 'SET_TOKEN',
      token: {
        access: accessToken,
        refresh: refreshToken
      }
    })
  }, [])

  return <Router />
}
