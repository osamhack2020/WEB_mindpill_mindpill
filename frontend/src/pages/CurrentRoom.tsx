import React, { useEffect, useState } from 'react'
import { useTracked } from '../states'
import { CurrentRoom as CurrentRoomType, Message as MessageType, User as UserType } from '../types'

type MessageProps = {
  message: MessageType
  user: UserType | undefined
}

function Message({ message, user }: MessageProps) {
  return (
    <div className={`chat_log ${message.out && 'out'}`}>
      <div className="avatar">
        <div className="profile_image"></div>
        <div>
          <div className="name">{user?.name}</div>
          <div className="timestamp">{message.timestamp}</div>
        </div>
      </div>
      <div className="message">{message.message}</div>
    </div>
  )
}

export default function CurrentRoom() {
  const [state, dispatch] = useTracked()
  const [currentRoomInfo, setCurrentRoomInfo] = useState<CurrentRoomType | undefined>(undefined)
  const [messages, setMessages] = useState<MessageType[] | undefined>([])

  useEffect(() => {
    scrollToBottom()
    setCurrentRoomInfo(getCurrentRoomInfo())
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages(currentRoomInfo?.messages)
  }, [currentRoomInfo?.messages])

  function getCurrentRoomInfo() {
    //currentRoomId에 맞는 roomInfo를 API로 받아와야 합니다.
    const fakeCurrentRoomInfo = {
      id: state.currentRoomId,
      messages: [{ message: '안녕하세요.', timestamp: '10:10 AM', out: true }],
      opponent: {
        id: 10,
        name: '김상대 상담관'
      }
    }
    return fakeCurrentRoomInfo
  }

  function handleCurrentRoomOff() {
    dispatch({ type: 'SET_SUB_PAGE', subPage: null })
  }

  function handleProfileClick() {
    // 상대방의 User.id 로 변경해야 합니다.
    dispatch({ type: 'SET_PROFILE_ID', profileId: 0 })
  }

  function scrollToBottom() {
    let chatLogs = document.getElementById('chat_logs')
    if (chatLogs) {
      chatLogs.scrollTop = chatLogs.scrollHeight
    }
  }

  function getTimestamp() {
    let date = new Date()
    let timestamp = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    } ${date.getHours() < 12 ? 'am' : 'pm'}`
    return timestamp
  }

  function addMessage(message: string) {
    setMessages(messages => [
      ...messages, //기존 채팅로그
      {
        message: message,
        timestamp: getTimestamp(),
        out: false
      }
    ])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement> & { target: { message: HTMLInputElement } }) {
    e.preventDefault()
    let message = e.target.message.value
    if (message) {
      addMessage(message)
    }
    e.target.message.value = ''
  }

  return (
    <div id="page_current_room">
      <div className="header">
        <div className="user_info">
          <div className="user_image"></div>
          <div className="user_detail">
            <div className="user_name">
              {currentRoomInfo?.opponent.name} {state.currentRoomId}
            </div>
            <div className="user_status online">
              <i className="fas fa-circle"></i>온라인
            </div>
          </div>
        </div>
        <div className="tools">
          <button className="tool off" onClick={handleCurrentRoomOff}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="tool user" onClick={handleProfileClick}>
            <i className="far fa-user-circle"></i>
          </button>
          <button className="tool"></button>
          <button className="tool"></button>
          <button className="tool"></button>
        </div>
      </div>
      <div className="chat_logs" id="chat_logs">
        {messages?.map((message, key) => {
          return <Message key={key} message={message} user={currentRoomInfo?.opponent} />
        })}
      </div>

      <form className="chat_inputs" onSubmit={handleSubmit}>
        <button className="add">
          <i className="fas fa-plus"></i>
        </button>
        <input type="text" name="message" placeholder="대화를 입력하세요."></input>
        <button className="send">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  )
}
