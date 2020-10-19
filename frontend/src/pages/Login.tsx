import React from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import axios from 'axios'
import { User } from '../routes'

type LoginProps = {
  user: User | null
}

export default function Login({ user }: LoginProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let query = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value
    }

    axios
      .post('/auth/code', query)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div id="page_login">
      <form id="form_login" onSubmit={handleSubmit}>
        <input className="styled sized" type="email" placeholder="이메일" autoFocus required />
        <input className="styled sized" type="password" placeholder="비밀번호" required />
        <input className="styled sized black" type="submit" value="로그인" />
      </form>
      <Link to="/join" className="link">
        <p>아직 회원이 아니신가요?</p>
      </Link>
    </div>
  )
}
