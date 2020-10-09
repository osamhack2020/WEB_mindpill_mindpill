import React from 'react'
import { Link, withRouter, RouteComponentProps, NavLink } from 'react-router-dom'
import logger from '../lib/log'

export interface LayoutProps {
  isLoggedIn: boolean
  children: React.ReactNode
}

function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <div className="app-container">
      <div className="header">
        <Link to="/" className="logo">
          Mind Pill
        </Link>
      </div>
      <div className="content-container">
        <div className="navbar">
          <ul>
            <NavLink to="/login" activeClassName="selected">
              <li>로그인</li>
            </NavLink>
            <NavLink to="/join" activeClassName="selected">
              <li>회원가입</li>
            </NavLink>
            <NavLink to="/chat" activeClassName="selected">
              <li>상담하기</li>
            </NavLink>
            <NavLink to="/userInfo" activeClassName="selected">
              <li>내정보</li>
            </NavLink>
          </ul>
          <ul>
            <NavLink to="/setting" activeClassName="selected">
              <li>설정</li>
            </NavLink>
            <NavLink to="/support" activeClassName="selected">
              <li>지원</li>
            </NavLink>
            <NavLink to="/logout" activeClassName="selected">
              <li>로그아웃</li>
            </NavLink>
          </ul>
        </div>
        <div className="content box-center">{children}</div>
      </div>
    </div>
  )
}

export default Layout
