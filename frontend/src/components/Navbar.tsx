import React, { useCallback, MouseEvent, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTracked } from '../state'
import { clearCookieToken } from '../lib/cookietoken'

export default function Navbar() {
  const [state, dispatch] = useTracked()
  const [activated, setActive] = useState(false)

  const toggleMenuHandler = useCallback(() => {
    setActive(activated => !activated)
  }, [])

  const logoutHandler = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    dispatch({ type: 'LOGOUT' })
    clearCookieToken()
  }, [])

  return (
    <div className="navbar is-primary">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          Mindpill
        </Link>

        <a
          role="button"
          className="navbar-burger burger"
          onClick={toggleMenuHandler}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={`navbar-menu${activated ? ' is-active' : ''}`}>
        <div className="navbar-end">
          {state.user == null ? (
            <>
              <NavLink
                to="/user/login"
                className="navbar-item"
                activeClassName="is-active">
                로그인
              </NavLink>
              <NavLink
                to="/user/register"
                className="navbar-item"
                activeClassName="is-active">
                회원가입
              </NavLink>
            </>
          ) : (
            <>
              <div className="navbar-item">{state.user.name}님</div>
              <a href="#" className="navbar-item" onClick={logoutHandler}>
                로그아웃
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
