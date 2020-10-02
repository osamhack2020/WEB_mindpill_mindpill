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

export class ChatRoomList extends React.Component {
  render() {
    return (
      <div className="chatroom-list box-top-column expand">
        <ChatRoom />
        <ChatRoom />
        <ChatRoom />
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

  render() {
    return (
      <div className="current-chatroom expand">
        <div className="chat-logs">
          {this.state.chatLogs.map((value, key) => {
            return (
              <ChatLog
                key={key}
                text={value.text}
                timestamp={value.timestamp}
                myLog={value.myLog}
              />
            )
          })}
        </div>
        <div className="chat-input">
          <div className="box-center expand">
            <div className="profile-image"></div>
          </div>
          <textarea placeholder="대화를 입력하세요." rows={2} />
        </div>
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

export default class Chat extends React.Component {
  render() {
    return (
      <div className="box-custom-1 expand">
        <ChatRoomList />
        <CurrentChatRoom />
        <ChatRoomInfo />
      </div>
    )
  }
}
