import React from 'react'
import { Link } from 'react-router-dom'

class Login extends React.Component {
  render() {
    return (
      <div className="box-center-column">
        <form className="form-login">
          <input type="text" placeholder="이메일" required></input>
          <input type="password" placeholder="비밀번호" required></input>
          <input type="submit" value="로그인"></input>
        </form>
        <Link to="/join">
          <p>아직 회원이 아니신가요?</p>
        </Link>
      </div>
    )
  }
}

export default Login
