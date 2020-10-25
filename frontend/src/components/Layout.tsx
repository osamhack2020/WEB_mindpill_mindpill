import React, { ReactNode } from 'react'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout(props: LayoutProps) {
  return (
    <div className="wrapper">
      <header className="site-header">
        <Navbar />
      </header>

      {props.children}

      <footer className="footer site-footer">&copy; 2020 Mindpill</footer>
    </div>
  )
}
