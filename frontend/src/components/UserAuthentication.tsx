import React, { useEffect } from 'react'

import { useTracked } from '../states'

import axios from 'axios'

export default function UserAuthentication() {
  const [state, dispatch] = useTracked()

  function refreshAccessToken(refresh_token: string) {
    axios({
      method: 'post',
      url: '/api/create_token',
      params: { request_type: 'refresh' },
      data: { refresh_token }
    })
      .then(response => {
        const { access_token, refresh_token } = response.data
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        dispatch({ type: 'SET_ACCESS_TOKEN', accessToken: access_token })
        localStorage.setItem('refreshToken', refresh_token)
      })
      .catch(error => {
        console.log(error)
      })
  }

  function updateMyTokenInfo() {
    axios({
      method: 'get',
      url: '/api/describe_token'
    })
      .then(response => {
        const { admin, groups, uid: id } = response.data
        dispatch({ type: 'SET_USER', user: { ...state.user, admin, groups, id } })
      })
      .catch(error => {
        console.log(error)
      })
  }

  function updateMyUserInfo() {
    axios
      .get('/api/describe_user', { params: { user_id: state.user.id } })
      .then(response => {
        const { created_at, email, gender, name, phone_number, updated_at } = response.data
        dispatch({ type: 'SET_USER', user: { ...state.user, created_at, email, gender, name, phone_number, updated_at } })
      })
      .catch(error => {
        console.log(error)
      })
  }
  function getUser(user_id: number) {
    let data = {}
    axios
      .get('/api/describe_user', { params: { user_id } })
      .then(response => {
        const { created_at, email, gender, name, phone_number, updated_at } = response.data
        data = { created_at, email, gender, name, phone_number, updated_at }
      })
      .catch(error => {
        console.log(error)
      })
    console.log('getUser() : ', data)
    return data
  }

  useEffect(() => {
    //암호화 해야합니다.
    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken) {
      console.log('Refresh Token 이 있습니다. Access Token을 발급받습니다.')
      refreshAccessToken(refreshToken)
    }
  }, [])

  useEffect(() => {
    //access_token 이 변경되면 토큰의 정보(id, groups, admin) 을 받아옵니다.
    console.log(state.accessToken)
    if (state.accessToken) {
      updateMyTokenInfo()
    }
  }, [state.accessToken])
  useEffect(() => {
    //user_id가 변경되면 사용자의 정보(created_at, email, gender, name, phone_number, updated_at) 를 받아옵니다.
    if (state.user.id) {
      updateMyUserInfo()
    }
  }, [state.user.id])

  useEffect(() => {
    console.log(state.user)
  }, [state.user])
  return <></>
}
