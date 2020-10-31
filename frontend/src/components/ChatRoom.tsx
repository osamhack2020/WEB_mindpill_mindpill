import JSBI from 'jsbi'
import React, {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo
} from 'react'
import { useTrackedState } from '../state'
import {
  joinRoom,
  decodeBase64Message,
  Room,
  TextMessage,
  ImageMessage,
  AudioMessage,
  VideoMessage,
  UserChangedMessage,
  TimeChangedMessage
} from '../lib/chat'
import { BigEndian } from '../lib/chat/binary'
import { MessageToken } from '../lib/chat/decode'
import { useInput } from '../hooks/input'
import { useAPI } from '../hooks/api'
import {
  DescribeRoomResponse,
  DescribeRoomResponseUser,
  describeRoom
} from '../api/describe_room'
import {
  LoadMessageResponse,
  loadMessage
} from '../api/load_message'
import { RoomNoteList } from '../components/NoteList'

interface ChatRoomProps {
  roomID: number
  token: string
  active: boolean
}

interface MessageWrapper {
  msg:
    | TextMessage
    | ImageMessage
    | AudioMessage
    | VideoMessage
  userID: Uint8Array
  timestamp: JSBI
}

function wrapMessageTokens(
  tokens: MessageToken[]
): MessageWrapper[] {
  let userID: Uint8Array | null = null
  let timestamp: JSBI | null = null
  return tokens
    .map<MessageWrapper | null>((token: MessageToken) => {
      if (typeof token !== 'string') {
        if (token.type === 'uid') {
          userID = token.id
          return null
        } else if (token.type === 'timestamp') {
          timestamp = token.timestamp
          return null
        }
      }
      if (userID == null || timestamp == null) {
        return null
      }
      let msg:
        | TextMessage
        | ImageMessage
        | AudioMessage
        | VideoMessage
      if (typeof token === 'string') {
        if (token.length === 0) {
          return null
        }
        msg = {
          text: token
        }
      } else if (token.type === 'image') {
        msg = {
          imageID: token.id
        }
      } else if (token.type === 'audio') {
        msg = {
          audioID: token.id
        }
      } else if (token.type === 'video') {
        msg = {
          videoID: token.id
        }
      } else {
        throw new Error('unreachable')
      }
      return {
        msg,
        userID,
        timestamp
      }
    })
    .filter<MessageWrapper>(
      (msg): msg is MessageWrapper => msg != null
    )
}

function isSameArray(
  a: Uint8Array | null,
  b: Uint8Array | null
): boolean {
  if (a == null && b == null) {
    return true
  }
  if (a == null || b == null) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }
  let i = a.length
  while (i--) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export default function ChatRoom({
  roomID,
  token,
  active
}: ChatRoomProps) {
  const { user } = useTrackedState()
  const roomRef = useRef<Room | null>(null)
  const userRef = useRef<UserChangedMessage | null>(null)
  const timestampRef = useRef<TimeChangedMessage | null>(
    null
  )
  const [messages, setMessages] = useState<
    MessageWrapper[]
  >([])
  const [input, inputHandler, setInput] = useInput('')
  const [roomInfo, roomDispatch] = useAPI<
    DescribeRoomResponse
  >()
  const [fetchedMessages, messageDispatch] = useAPI<
    LoadMessageResponse
  >()
  const [disconnected, setDisconnected] = useState(false)
  const userMap = useMemo(() => {
    const userMap: {
      [key: string]: DescribeRoomResponseUser
    } = {}
    roomInfo?.users.forEach(user => {
      userMap[user.id] = user
    })
    return userMap
  }, [roomInfo])
  const messageWrapperRef = useRef<HTMLDivElement | null>(
    null
  )

  useEffect(() => {
    setMessages([])
    describeRoom({ room_id: roomID }, token, roomDispatch)
    loadMessage(
      {
        room_id: roomID,
        timestamp: Math.floor(Date.now() / 1000).toString()
      },
      token,
      messageDispatch
    )
  }, [roomID])

  useEffect(() => {
    if (fetchedMessages != null) {
      const messageTokens = decodeBase64Message(
        fetchedMessages.message
      )
      const messages = wrapMessageTokens(messageTokens)
      const timestamp = JSBI.BigInt(
        fetchedMessages.timestamp
      )
      setMessages(prevMessages => [
        ...messages,
        ...prevMessages
      ])
    }
  }, [fetchedMessages])

  useEffect(() => {
    scrollDown()
  }, [messages])

  const scrollDown = useCallback(() => {
    const { current } = messageWrapperRef
    if (current != null) {
      current.scrollTop = current.scrollHeight
      setTimeout(() => {
        current.scrollTop = current.scrollHeight
      }, 200)
    }
  }, [])

  // Callbacks
  const sendHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (input.length === 0) {
        return
      }
      roomRef.current?.send({
        text: encodeURIComponent(input)
      })
      setInput('')
      e.currentTarget.value = ''
    },
    [input]
  )

  const messageHandler = useCallback(
    (
      msg:
        | TextMessage
        | ImageMessage
        | AudioMessage
        | VideoMessage
    ) => {
      const userID = userRef.current?.userID
      const timestamp = timestampRef.current?.timestamp
      if (userID == null || timestamp == null) {
        return
      }
      setMessages(prevMessages => [
        ...prevMessages,
        {
          msg: msg,
          userID: userID,
          timestamp: timestamp
        }
      ])
    },
    []
  )
  const userHandler = useCallback(
    (msg: UserChangedMessage) => {
      userRef.current = msg
    },
    []
  )
  const timestampHandler = useCallback(
    (msg: TimeChangedMessage) => {
      timestampRef.current = msg
    },
    []
  )
  const disconnectHandler = useCallback(() => {
    setDisconnected(true)
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
        room.onclose = disconnectHandler
        roomRef.current = room
      })
      .catch((err: any) => {
        alert(err)
      })
    return () => {
      roomRef.current?.close(1000, 'closed by user request')
    }
  }, [])

  return (
    <>
      <div className="room-messages">
        <div
          className={`modal${
            disconnected ? ' is-active' : ''
          }`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <article className="message is-danger">
              <div className="message-header">
                <p>오류</p>
              </div>
              <div className="message-body">
                <p>채팅 서버와의 연결이 끊겼습니다.</p>
                <p>연결 상태를 확인해주세요.</p>
              </div>
            </article>
          </div>
        </div>
        <div
          className="room-messages-inner"
          ref={messageWrapperRef}>
          {messages.map(
            (
              { msg, userID, timestamp }: MessageWrapper,
              i: number
            ) => {
              const prevMessage =
                i > 0 ? messages[i - 1] : null
              const nextMessage =
                i + 1 < messages.length
                  ? messages[i + 1]
                  : null
              if ('text' in msg) {
                const userIDInt = BigEndian.uint64(userID)
                const userIDNumber = JSBI.toNumber(
                  userIDInt
                )
                const isMine =
                  user != null &&
                  JSBI.equal(
                    userIDInt,
                    JSBI.BigInt(user.id)
                  )
                return (
                  <div
                    className={`message-bubble${
                      isMine ? ' is-mine' : ''
                    }`}>
                    {!isSameArray(
                      prevMessage?.userID || null,
                      userID
                    ) && (
                      <div className="message-user">
                        {userMap[userIDNumber].rank}{' '}
                        {userMap[userIDNumber].name}
                      </div>
                    )}
                    <div className="message-content">
                      <div className="message-body">
                        {decodeURIComponent(msg.text)}
                      </div>
                      {JSBI.notEqual(
                        timestamp,
                        nextMessage?.timestamp ||
                          JSBI.BigInt(-1)
                      ) && (
                        <div className="message-time">
                          {JSBI.remainder(
                            JSBI.divide(
                              JSBI.add(
                                timestamp,
                                JSBI.BigInt(32400)
                              ),
                              JSBI.BigInt(3600)
                            ),
                            JSBI.BigInt(24)
                          )}
                          :
                          {JSBI.remainder(
                            JSBI.divide(
                              timestamp,
                              JSBI.BigInt(60)
                            ),
                            JSBI.BigInt(60)
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
            }
          )}
        </div>
      </div>

      {roomInfo != null && roomInfo.is_counselor && (
        <div className="counselor-notes">
          <RoomNoteList
            groupID={roomInfo.group_id}
            roomID={roomID}
          />
        </div>
      )}

      <form onSubmit={sendHandler}>
        <div className="field has-addons room-input">
          <div className="control is-expanded">
            <input
              type="text"
              className="input is-radiusless"
              value={input}
              onChange={inputHandler}
              onFocus={scrollDown}
              disabled={!active || disconnected}
            />
          </div>
          <div className="control">
            <input
              type="submit"
              className="button is-primary is-radiusless"
              value="보내기"
            />
          </div>
        </div>
      </form>
    </>
  )
}
