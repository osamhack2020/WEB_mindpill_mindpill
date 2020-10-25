import React, { useEffect } from 'react'
import { useTracked } from '../state'
import axios from 'axios'
import { initialState } from '../state'

export default function Logout() {
  const [state, dispatch] = useTracked()

  function handleLogout() {
    dispatch({ type: 'SET_ACCESS_TOKEN', accessToken: '' })
    dispatch({ type: 'SET_USER', user: initialState.user })
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
  }

  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div id="page_template_simple">
      <h3>
        로그아웃을 처리중 입니다. <br />
        잠시만 기다려주세요.
      </h3>
    </div>
  )
}
