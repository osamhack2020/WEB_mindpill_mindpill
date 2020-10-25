export type User = {
  id: number
  name: string
}

export type Room = {
  id: number
  lastMessage: {
    message: string
    timestamp: string // string 이 아닌 Date 타입일 수 있습니다.
  }
  opponent: User
}

export type Message = {
  message: string
  timestamp: string // string 이 아닌 Date 타입일 수 있습니다.
  out: boolean
}

export type CurrentRoom = {
  id: number
  messages: Message[]
  opponent: User
}

export type Auth = 'admin' | 'manager' | 'counselor' | 'commander' | 'user' | null
