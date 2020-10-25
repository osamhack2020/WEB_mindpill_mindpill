import React, { useEffect, useState } from 'react'
import Layout from './pages/Layout'
import { Router } from './routes'
import UserAuthentication from './components/UserAuthentication'

export default function App() {
  return (
    <Layout>
      <UserAuthentication />
      <Router />
    </Layout>
  )
}
