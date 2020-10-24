import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GlobalData } from '../App'
import CurrentRoom from './CurrentRoom'
import Profile from './Profile'

type LayoutProps = {
  globalData: GlobalData
  children: React.ReactNode
  changeUser: (value: number) => void
}

function Layout({ children, changeUser, globalData }: LayoutProps) {
  return (
    <div id="app_container">
      <div id="app_navbar">
        {globalData.user ? (
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
            <NavLink to="/manage" className="nav" activeClassName="selected">
              <i className="fas fa-tasks"></i>
            </NavLink>
            <div className="nav menu">
              <i className="fas fa-bars"></i>
            </div>
          </>
        )}
      </div>
      <div id="app_main">{children}</div>
      {globalData.showCurrentRoom > 0 && (
        <div id="app_sub">
          <CurrentRoom globalData={globalData} />
        </div>
      )}
      <div id="app_right_sidebar" className={globalData.showProfile > 0 ? 'in' : 'out'}>
        <Profile globalData={globalData} />
      </div>
    </div>
  )
}

export default Layout
