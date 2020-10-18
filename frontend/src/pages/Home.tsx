import React from 'react'
import { User } from '../routes'

type HomeProps = {
  user: User | null
}

export default function Home({ user }: HomeProps) {
  return <div>This is HomePage</div>
}
