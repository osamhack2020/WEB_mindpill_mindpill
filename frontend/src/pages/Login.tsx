import React from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import axios from 'axios'

class Login extends React.Component {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    let query = {
      email: e.target.email.value,
      password: e.target.password.value
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

  render() {
    return (
      <div className="box-center-column">
        <form id="form-login" onSubmit={this.handleSubmit}>
          <Input name="email" type="text" placeholder="이메일" required />
          <Input name="password" type="password" placeholder="비밀번호" required />
          <Input type="submit" value="로그인" />
        </form>
        <Link to="/join">
          <p>아직 회원이 아니신가요?</p>
        </Link>
      </div>
    )
  }
}

export default Login
