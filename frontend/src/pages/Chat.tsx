import React from 'react'
import Layout from './Layout'

export class ChatRoom extends React.Component {
  render() {
    return (
      <div className="chatroom">
        <div className="profile-image"></div>
        <div className="wrapper">
          <div className="name">홍길동 상담관</div>
          <span className="last-message">무슨 고민이 있나요?</span>
          <span className="last-message-time">10분전</span>
        </div>
      </div>
    )
  }
}

export class ChatBrowser extends React.Component {
  render() {
    return (
      <div className="chat-browser box-top-column expand">
        <div className="chat-browser-navbar expand">
          <div className="profile-image-area">
            <div className="profile-image">
              <i className="fas fa-user"></i>
            </div>
          </div>
          <ul>
            <li>
              <i className="fas fa-comment-alt"></i>
            </li>
            <li>
              <i className="fas fa-users"></i>
            </li>
          </ul>
        </div>
        <div className="chat-browser-content">
          <div className="chat-browser-search">
            <div className="chat-browser-search-input">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="검색"></input>
            </div>
          </div>
          <div className="chatroom-list">
            <ChatRoom />
            <ChatRoom />
            <ChatRoom />
          </div>
        </div>
      </div>
    )
  }
}

export interface ChatLogProps {
  text: string
  timestamp: string
  myLog: boolean
}

export class ChatLog extends React.Component<ChatLogProps> {
  render() {
    return (
      <div className={`chat-log ${this.props.myLog ? 'myLog' : 'opponentLog'}`}>
        <div className="wrapper">
          <div className="text">{this.props.text}</div>
          <div className="timestamp">{this.props.timestamp}</div>
        </div>
        {this.props.myLog ? '' : <div className="profile-image"></div>}
      </div>
    )
  }
}

export class ChatRoomInfo extends React.Component {
  render() {
    return (
      <div className="chatroom-info box-top-column expand">
        <div className="profile-image"></div>
        <div className="name">홍길동 상담관</div>
        <div className="regiment">12사단 00연대 00중대 심리상담관</div>
        <hr className="hr"></hr>
        <div className="info-category">연락처</div>
        <div className="wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
      </div>
    )
  }
}

export class CurrentChatRoom extends React.Component {
  state = {
    chatLogs: [
      {
        text: '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        myLog: true
      },
      {
        text: '안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      },
      {
        text:
          '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        myLog: true
      },
      {
        text:
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      },
      {
        text:
          '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        myLog: true
      },
      {
        text:
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      },
      {
        text:
          '이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다이것은 테스트 텍스트입니다세요. 이것은 테스트 텍스트입니다',
        timestamp: '10:10 am',
        myLog: true
      },
      {
        text:
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      }
    ]
  }

  goToBottom = () => {
    let chatLogs = document.getElementById('chat-logs')
    console.log(chatLogs)
    if (chatLogs) {
      chatLogs.scrollTop = chatLogs.scrollHeight
    }
  }

  getTimestamp = () => {
    let date = new Date()
    let timestamp = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    } ${date.getHours() < 12 ? 'am' : 'pm'}`
    return timestamp
  }

  addMessage = (message: string) => {
    this.setState(
      {
        chatLogs: [
          ...this.state.chatLogs,
          {
            text: message,
            timestamp: this.getTimestamp(),
            myLog: true
          }
        ]
      },
      () => {
        this.goToBottom()
      }
    )
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement> & { target: { message: HTMLInputElement } }) => {
    e.preventDefault()
    let message = e.target.message.value
    this.addMessage(message)
    e.target.message.value = ''
  }
  render() {
    return (
      <div className="current-chatroom expand">
        <div className="chat-area expand">
          <div className="chat-logs" id="chat-logs">
            <div className="chat-log-null"></div>
            {this.state.chatLogs.map((value, key) => {
              return <ChatLog key={key} text={value.text} timestamp={value.timestamp} myLog={value.myLog} />
            })}
            <div className="chat-log-null"></div>
          </div>
          <form className="chat-input" onSubmit={this.handleSubmit}>
            <div className="box-center expand">
              <div className="attachment">
                <i className="fas fa-paperclip"></i>
              </div>
            </div>
            <input name="message" placeholder="대화를 입력하세요." />
            <button className="chat-send">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
        <ChatRoomInfo />
      </div>
    )
  }
}

export default class Chat extends React.Component {
  render() {
    return (
      <div className="box-page-chat expand">
        <ChatBrowser />
        <CurrentChatRoom />
      </div>
    )
  }
}
