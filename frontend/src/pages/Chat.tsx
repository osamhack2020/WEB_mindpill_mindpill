import React from 'react'
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import database from '../tempDatabase'

export interface friend {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

export interface chatRoom {
  id: number
  friend: friend
  last_message: {
    text: string
    timestamp: Date
  }
}

export interface UserInfoMatchParams {
  id: string
}

export interface UserInfoProps {}

export class UserInfo extends React.Component<UserInfoProps & RouteComponentProps<UserInfoMatchParams>> {
  // 이곳에 있는 모든 정보를 Props에서 가져올 수 있도록 바꿔야 합니다.

  render() {
    return (
      <div className="user-info box-top-column expand">
        <div className="profile-image">
          <i className="fas fa-user"></i>
        </div>
        <div className="name">홍길동 상담관</div>
        <div className="regiment">12사단 00연대 00중대 심리상담관</div>
        <div className="info-category">연락처</div>
        <div className="info-wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="info-wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="info-wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <div className="info-wrapper">
          <div className="info-title">군전화</div>
          <div className="info-content">1123-456-789</div>
        </div>
        <button className="counsel-button">
          <span className="counsel-button-icon">
            <i className="fas fa-headset"></i>
          </span>
          <span className="counsel-button-text">상담하기</span>
        </button>
        <button className="counsel-button">
          <span className="counsel-button-icon">
            <i className="fas fa-headset"></i>
          </span>
          <span className="counsel-button-text">익명 상담하기</span>
        </button>
      </div>
    )
  }
}

export const UserInfoRouted = withRouter(UserInfo)

export interface ChatLogProps {
  text: string
  timestamp: string
  myLog: boolean
}

export class ChatLog extends React.Component<ChatLogProps> {
  // 여기서 opponent라는 말을 써야하나 키워드 정리부터
  render() {
    return (
      <div className={`chat-log ${this.props.myLog ? 'myLog' : 'opponentLog'}`}>
        <div className="wrapper">
          <div className="text">{this.props.text}</div>
          <div className="timestamp">{this.props.timestamp}</div>
        </div>
        {!this.props.myLog && (
          <div className="profile-image">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>
    )
  }
}

export class CurrentChatRoom extends React.Component {
  componentDidMount = () => {
    this.scrollToBottom()
  }
  // 채팅내역을 로드할 수 있는 API가 필요합니다. (채팅방 id)

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
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다. 안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      },
      {
        text:
          '안녕하세요. 이것은 상대방 테스트 텍스트입니다. 안녕하세요. 이것은 상대방 테스트 텍스트입니다안녕하세요. 이것은 상대방 테스트 텍스트입니다',
        timestamp: '10:12 am',
        myLog: false
      }
    ]
  }

  scrollToBottom = () => {
    let chatLogs = document.getElementById('chat-logs')
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
          ...this.state.chatLogs, //기존 채팅로그
          {
            text: message,
            timestamp: this.getTimestamp(),
            myLog: true
          }
        ]
      },
      () => {
        this.scrollToBottom()
      }
    )
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement> & { target: { message: HTMLInputElement } }) => {
    e.preventDefault()
    let message = e.target.message.value
    if (message) {
      this.addMessage(message)
    }
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
      </div>
    )
  }
}

export interface ChatRoomListProps {
  chatRooms: chatRoom[]
}
export interface ChatRoomListStates {}

export class ChatRoomList extends React.Component<ChatRoomListProps, ChatRoomListStates> {
  //현재 사용자가 열람할 수 있는 모든 채팅방을 가져올 수 있는 API가 필요합니다.

  render() {
    return (
      <div className="chatroom-list">
        {this.props.chatRooms.map((chatRoom, index) => {
          return (
            <NavLink key={index} to={`/chat/chatrooms/${chatRoom.id}`} className="chatroom" activeClassName="selected">
              <div className="profile-image">
                <i className="fas fa-user"></i>
              </div>
              <div className="wrapper">
                <div className="name">
                  {chatRoom.friend.name} {chatRoom.friend.authority == 4 ? '상담관' : '알수없음'}
                </div>
                <span className="last-message">{chatRoom.last_message.text}</span>
                <span className="last-message-time">{chatRoom.last_message.timestamp.getDate()}</span> {/** Format을 맞춰줘야 합니다 */}
              </div>
            </NavLink>
          )
        })}
      </div>
    )
  }
}

export interface FriendListProps {
  friends: friend[]
}
export class FriendList extends React.Component<FriendListProps> {
  render() {
    return (
      <div className="friend-list">
        {this.props.friends.map((friend, index) => {
          return (
            <NavLink key={index} to={`/chat/friends/${friend.id}`} className="friend" activeClassName="selected">
              <span className="profile-image"></span>
              <span className="friend-name">
                {friend.name} {friend.authority == 4 ? '상담관' : ''}
              </span>
            </NavLink>
          )
        })}
      </div>
    )
  }
}

export interface ChatProps {}
export interface ChatStates {
  chatData: {
    chatRooms: chatRoom[]
    friends: friend[]
  }
}

export default class Chat extends React.Component<ChatProps, ChatStates> {
  state = {
    chatData: { chatRooms: [], friends: [] }
  }

  getChatData = () => {
    //임시 데이터베이스에서 가져온 정보입니다.
    let data = database.API_CHAT_SELF
    return data
  }

  componentDidMount = () => {
    this.setState({ chatData: this.getChatData() })
  }

  render() {
    return (
      <div className="box-left expand">
        <div className="chat">
          <div className="chat-navbar">
            <div className="profile-image-area">
              <div className="profile-image">
                <i className="fas fa-user"></i>
              </div>
            </div>
            <ul>
              <NavLink to="/chat/chatrooms" activeClassName="selected">
                <li>
                  <i className="fas fa-comment-alt"></i>
                </li>
              </NavLink>
              <NavLink to="/chat/friends" activeClassName="selected">
                <li>
                  <i className="fas fa-users"></i>
                </li>
              </NavLink>
            </ul>
          </div>
          <div className="chat-navbar-content">
            <div className="chat-search">
              <div className="chat-search-input">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="검색"></input>
              </div>
            </div>
            <Switch>
              <Redirect exact path="/chat" to="/chat/chatrooms" /> {/** /chat/chatrooms 를 기본 페이지로 설정하기 위함. */}
              <Route path="/chat/chatrooms">
                <ChatRoomList chatRooms={this.state.chatData.chatRooms} />
              </Route>
              <Route path="/chat/friends">
                <FriendList friends={this.state.chatData.friends} />
              </Route>
            </Switch>
          </div>
          <Route path={['/chat/chatrooms/:id', '/chat/friends/:id']}>
            <div className="chat-content">
              <UserInfoRouted />
              <Route path="/chat/chatrooms/:id">
                <CurrentChatRoom />
              </Route>
            </div>
          </Route>
        </div>
      </div>
    )
  }
}
