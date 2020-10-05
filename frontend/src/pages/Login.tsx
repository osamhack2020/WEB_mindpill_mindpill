import React from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'

class Login extends React.Component {
  render() {
    return (
      <div className="box-center-column">
        <form className="form-login">
          <Input type="text" placeholder="이메일" required />
          <Input type="password" placeholder="비밀번호" required />
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
