import React from 'react'
import { User } from '../App'

type NotFoundProps = {
  user: User | null
}

export default function NotFound({ user }: NotFoundProps) {
  return <div>404 Not Found</div>
}
