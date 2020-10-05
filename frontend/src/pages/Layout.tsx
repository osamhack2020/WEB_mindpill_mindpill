import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
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
            <Link to="/login">
              <li>로그인</li>
            </Link>
            <Link to="/join">
              <li>회원가입</li>
            </Link>
            <Link to="/chat">
              <li>상담하기</li>
            </Link>
            <Link to="/">
              <li>내정보</li>
            </Link>
          </ul>
          <ul>
            <Link to="/setting">
              <li>설정</li>
            </Link>
            <Link to="/support">
              <li>지원</li>
            </Link>
            <Link to="/logout">
              <li>로그아웃</li>
            </Link>
          </ul>
        </div>
        <div className="content box-center">{children}</div>
      </div>
    </div>
  )
}

export default Layout
