import React, { useEffect, useState } from 'react'
import { GlobalData } from '../App'

type LogProps = {
  out?: boolean
  message: string
  timestamp: string
}

function Log({ out = false, message, timestamp }: LogProps) {
  return (
    <div className={`chat_log ${out && 'out'}`}>
      <div className="avatar">
        <div className="profile_image"></div>
        <div>
          <div className="name">김현우 상담관</div>
          <div className="timestamp">{timestamp}</div>
        </div>
      </div>
      <div className="message">{message}</div>
    </div>
  )
}

type CurrentRoomProps = {
  globalData: GlobalData
}
export default function CurrentRoom({ globalData }: CurrentRoomProps) {
  const [chatLogs, setChatLogs] = useState<LogProps[]>([])

  useEffect(() => {
    scrollToBottom()
    setChatLogs([
      {
        message: '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        out: true
      },
      {
        message: '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        out: true
      },
      {
        message: '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        out: true
      },
      {
        message: '안녕하세요',
        timestamp: '10:12 am',
        out: false
      },
      {
        message: '안녕하세요. 이것은 상대방 테스트 텍스트입니다. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        out: false
      },
      {
        message:
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다. 안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        out: false
      }
    ])
  }, [])
  useEffect(() => {
    scrollToBottom()
  }, [chatLogs])

  function handleOffSub() {
    globalData.changeSub(0)
  }

  function scrollToBottom() {
    console.log('bottom')
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
    setChatLogs([
      ...chatLogs, //기존 채팅로그
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
            <div className="user_name">김현우 상담관 {globalData.showSub}</div>
            <div className="user_status online">
              <i className="fas fa-circle"></i>온라인
            </div>
          </div>
        </div>
        <div className="tools">
          <button className="tool off" onClick={handleOffSub}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="tool user" onClick={handleOffSub}>
            <i className="far fa-user-circle"></i>
          </button>
          <button className="tool off" onClick={handleOffSub}></button>
          <button className="tool off" onClick={handleOffSub}></button>
          <button className="tool off" onClick={handleOffSub}></button>
        </div>
      </div>
      <div className="chat_logs" id="chat_logs">
        {chatLogs.map((log, key) => {
          return <Log key={key} message={log.message} timestamp={log.timestamp} out={log.out} />
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
