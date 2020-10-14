import React from 'react'
import { User } from '../App'

type HomeProps = {
  user: User | null
}

export default function Home({ user }: HomeProps) {
  return <div>This is HomePage</div>
}
