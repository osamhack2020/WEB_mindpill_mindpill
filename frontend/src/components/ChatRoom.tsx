import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  KeyboardEvent
} from 'react'
import {
  joinRoom,
  Room,
  Message,
  TextMessage,
  ImageMessage,
  VideoMessage,
  UserChangedMessage,
  TimeChangedMessage,
  ErrorMessage
} from '../lib/chat'

interface ChatRoomProps {
  roomID: number
  token: string
}

export default function ChatRoom({ roomID, token }: ChatRoomProps) {
  const roomRef = useRef<Room | null>(null)

  const [messages, setMessages] = useState<Message[]>([])

  // Callbacks
  const inputSubmitHandler = useCallback(
    ({ key, currentTarget }: KeyboardEvent<HTMLInputElement>) => {
      if (key === 'Enter') {
        try {
          roomRef.current?.send({ text: currentTarget.value })
        } catch (e) {
          alert(e)
        }
        currentTarget.value = ''
      }
    },
    []
  )

  const textHandler = useCallback((msg: TextMessage) => {
    setMessages([...messages, msg])
  }, [])
  const imageHandler = useCallback((msg: ImageMessage) => {
    setMessages([...messages, msg])
  }, [])
  const videoHandler = useCallback((msg: VideoMessage) => {
    setMessages([...messages, msg])
  }, [])
  const userChangedHandler = useCallback((msg: UserChangedMessage) => {
    setMessages([...messages, msg])
  }, [])
  const timeChangedHandler = useCallback((msg: TimeChangedMessage) => {
    setMessages([...messages, msg])
  }, [])
  const errorHandler = useCallback((msg: ErrorMessage) => {
    setMessages([...messages, msg])
  }, [])

  useEffect(() => {
    joinRoom(roomID, token)
      .then(room => {
        room.ontext = textHandler
        room.onimage = imageHandler
        room.onvideo = videoHandler
        room.onuserchanged = userChangedHandler
        room.ontimechanged = timeChangedHandler
        room.onerror = errorHandler
        roomRef.current = room
      })
      .catch((err: any) => {
        alert(err)
      })
    return () => {
      roomRef.current?.close()
    }
  }, [])

  return (
    <div>
      <div className="messages">
        {messages.map((msg: Message) => {
          if ('text' in msg) {
            return <p>{msg.text}</p>
          }
        })}
      </div>
      <input type="text" onKeyPress={inputSubmitHandler}></input>
    </div>
  )
}
