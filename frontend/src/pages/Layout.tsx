import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { User } from '../routes'

type LayoutProps = {
  user: User | null
  children: React.ReactNode
  showSub: number
  changeUser: (value: number) => void
  changeSub: (id: number) => void
}

function Layout({ user, children, showSub, changeUser, changeSub }: LayoutProps) {
  function handleOffSub() {
    changeSub(0)
  }

  return (
    <div id="app_container">
      <div id="app_navbar">
        {user ? (
          <>
            <Link to="/" className="logo">
              MindPill
            </Link>
            <Link to="/login" className="login">
              로그인
            </Link>
            <Link to="/join" className="join">
              회원가입
            </Link>
          </>
        ) : (
          <>
            <NavLink to="/counselrooms" className="nav" activeClassName="selected">
              <i className="fas fa-comment"></i>
            </NavLink>
            <NavLink to="/friends" className="nav" activeClassName="selected">
              <i className="fas fa-user-friends"></i>
            </NavLink>
            <NavLink to="/settings" className="nav" activeClassName="selected">
              <i className="fas fa-cog"></i>
            </NavLink>
            <NavLink to="counsel_rooms" className="nav" activeClassName="selected">
              <i className="fas fa-comment"></i>
            </NavLink>
            <div className="nav menu">
              <i className="fas fa-bars"></i>
            </div>
          </>
        )}
      </div>
      <div id="app_main">{children}</div>
      {showSub != 0 && (
        <div id="app_sub">
          상담방 정보는 {showSub} 입니다.
          <button onClick={handleOffSub}>끄기</button>
        </div>
      )}
    </div>
  )
}

export default Layout
