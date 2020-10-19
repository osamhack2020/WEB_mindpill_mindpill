import React, { MouseEventHandler } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { User, parseAuthority } from '../routes'

type LayoutProps = {
  user: User | null
  children: React.ReactNode
  changeUser: (value: number) => void
}

function Layout({ user, children, changeUser }: LayoutProps) {
  return (
    <div id="app_container">
      <div id="app_header">
        <Link to="/" className="logo">
          마인드필
        </Link>
      </div>
      <div id="app_main">{children}</div>
      <div id="app_navbar">
        <NavLink to="couselrooms" className="nav" activeClassName="selected">
          <i className="fas fa-comment"></i>
        </NavLink>
        <NavLink to="friends" className="nav" activeClassName="selected">
          <i className="fas fa-user-friends"></i>
        </NavLink>
        <NavLink to="settings" className="nav" activeClassName="selected">
          <i className="fas fa-cog"></i>
        </NavLink>
        <NavLink to="counsel_rooms" className="nav" activeClassName="selected">
          <i className="fas fa-comment"></i>
        </NavLink>
        <div className="nav menu">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </div>
  )
}

export default Layout
