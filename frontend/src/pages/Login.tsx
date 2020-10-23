import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { GlobalData } from '../App'

type LoginProps = {
  globalData: GlobalData
}

export default function Login({ globalData }: LoginProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    console.log(email, password)
    globalData.handleLogin(email, password)
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
