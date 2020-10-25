import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useTracked } from '../state'

export default function Login() {
  const [state, dispatch] = useTracked()
  function handleLogin(email: string, password: string) {
    // 초기 access token 과 refresh token 을 받는 곳입니다.
    axios({
      method: 'post',
      url: '/api/create_token',
      params: { request_type: 'password' },
      data: { email, password }
    })
      .then(response => {
        const { access_token, refresh_token } = response.data
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        localStorage.setItem('refreshToken', refresh_token)
        dispatch({ type: 'SET_ACCESS_TOKEN', accessToken: access_token })
        console.log({ access_token, refresh_token })
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    handleLogin(email, password)
  }

  return (
    <div id="page_login">
      <form id="form_login" onSubmit={handleSubmit}>
        <input className="styled sized" type="email" name="email" placeholder="이메일" autoFocus required />
        <input className="styled sized" type="password" name="password" placeholder="비밀번호" required />
        <input className="styled sized black" type="submit" value="로그인" />
      </form>
      <Link to="/join">
        <p className="link">아직 회원이 아니신가요?</p>
      </Link>
    </div>
  )
}
