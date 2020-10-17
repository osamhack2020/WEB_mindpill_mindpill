import React, { MouseEventHandler } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { User, parseAuthority } from '../App'

type LayoutProps = {
  user: User | null
  children: React.ReactNode
  changeUser: (value: number) => void
}

function Layout({ user, children, changeUser }: LayoutProps) {
  // 서비스가 완성되면 삭제해야 합니다.
  function handleLoginSimulator(e: React.MouseEvent<HTMLInputElement>) {
    const value = parseInt(e.currentTarget.value)
    console.log(value)
    changeUser(value)
  }
  return (
    <div className="app-container">
      <div className="header">
        <Link to="/" className="logo">
          Mind Pill
        </Link>
        {user && (
          <div className="header-profile">
            <span className="header-profile-image">
              <i className="fas fa-user"></i>
            </span>
            <span className="header-profile-name">{`${user.name} ${parseAuthority(user.authority)}`}</span>
          </div>
        )}
        <div className="login-simulator">
          <input onClick={handleLoginSimulator} type="radio" id="serviceManager" name="login" value="1" />
          <input onClick={handleLoginSimulator} type="radio" id="regimentManager" name="login" value="2" />
          <input onClick={handleLoginSimulator} type="radio" id="commander" name="login" value="3" defaultChecked />
          <input onClick={handleLoginSimulator} type="radio" id="counselor" name="login" value="4" />
          <input onClick={handleLoginSimulator} type="radio" id="standardUser" name="login" value="5" />
          <input onClick={handleLoginSimulator} type="radio" id="noUser" name="login" value="6" />
        </div>
      </div>
      <div className="page-content-container">
        <div className="navbar">
          <ul>
            {!user && (
              <>
                <NavLink to="/login" activeClassName="selected">
                  <li>로그인</li>
                </NavLink>
                <NavLink to="/join" activeClassName="selected">
                  <li>회원가입</li>
                </NavLink>
              </>
            )}
            {user && (
              <>
                <NavLink to="/counsel" activeClassName="selected">
                  <li>상담하기</li>
                </NavLink>
                <NavLink to="/userInfo" activeClassName="selected">
                  <li>내정보</li>
                </NavLink>
                <NavLink to="/manage" activeClassName="selected">
                  <li>회원관리</li>
                </NavLink>
              </>
            )}
          </ul>
          <ul>
            <NavLink to="/support" activeClassName="selected">
              <li>지원</li>
            </NavLink>
            {user && (
              <>
                <NavLink to="/setting" activeClassName="selected">
                  <li>설정</li>
                </NavLink>
                <NavLink to="/logout" activeClassName="selected">
                  <li>로그아웃</li>
                </NavLink>
              </>
            )}
          </ul>
        </div>
        <div className="page-content box-center">{children}</div>
      </div>
    </div>
  )
}

export default Layout
