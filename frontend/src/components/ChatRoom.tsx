import JSBI from 'jsbi'
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
  TextMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  UserChangedMessage,
  TimeChangedMessage
} from '../lib/chat'

interface ChatRoomProps {
  roomID: number
  token: string
}

interface MessageWrapper {
  msg: TextMessage | ImageMessage | AudioMessage | VideoMessage
  userID?: Uint8Array
  timestamp?: JSBI
}

export default function ChatRoom({ roomID, token }: ChatRoomProps) {
  const roomRef = useRef<Room | null>(null)
  const userRef = useRef<UserChangedMessage | null>(null)
  const timestampRef = useRef<TimeChangedMessage | null>(null)
  const [messages, setMessages] = useState<MessageWrapper[]>([])

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

  const messageHandler = useCallback(
    (msg: TextMessage | ImageMessage | AudioMessage | VideoMessage) => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          msg: msg,
          userID: userRef.current?.userID,
          timestamp: timestampRef.current?.timestamp
        }
      ])
    },
    []
  )
  const userHandler = useCallback((msg: UserChangedMessage) => {
    userRef.current = msg
  }, [])
  const timestampHandler = useCallback((msg: TimeChangedMessage) => {
    timestampRef.current = msg
  }, [])

  // initialize room
  useEffect(() => {
    joinRoom(roomID, token)
      .then(room => {
        room.ontext = messageHandler
        room.onimage = messageHandler
        room.onaudio = messageHandler
        room.onvideo = messageHandler
        room.onuserchanged = userHandler
        room.ontimechanged = timestampHandler
        // room.onerror = errorHandler
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
    <div className="room">
      <div className="messages">
        {messages.map(({ msg, userID, timestamp }: MessageWrapper) => {
          if ('text' in msg) {
            return (
              <p>
                {userID}: {msg.text} <small>({timestamp})</small>
              </p>
            )
          }
        })}
      </div>
      <input type="text" onKeyPress={inputSubmitHandler}></input>
    </div>
  )
}
