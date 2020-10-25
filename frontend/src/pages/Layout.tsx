import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTracked } from '../states'
import CurrentRoom from './CurrentRoom'
import Profile from './Profile'

type LayoutProps = {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const [state, dispatch] = useTracked()
  return (
    <div id="app_container">
      <div id="app_navbar">
        {!state.user ? (
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
      {state.subPage != null && (
        <div id="app_sub">
          {state.subPage == 'COUNSEL_ROOM' && <CurrentRoom />}
          {state.subPage == 'MANAGE' && ''}
        </div>
      )}

      <div id="app_right_sidebar" className={state.profileId > 0 ? 'in' : 'out'}>
        <Profile />
      </div>
    </div>
  )
}

export default Layout
