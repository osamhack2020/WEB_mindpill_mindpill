import React, { useEffect, useState } from 'react'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { useHistory, useParams } from 'react-router'
import database from '../tempDatabase'
import { parseAuthority, User } from '../routes'
import Toolbox from '../components/CounselToolbox'

type friend = {
  id: number
  email: string
  name: string
  sv_number: string
  phone_number: string
  authority: number
}

type counselRoom = {
  id: number
  friend: friend
  last_message: {
    text: string
    timestamp: Date
  }
}

type UserInfoProps = {
  userInfos: friend[] | undefined
}

type UserInfoParams = {
  id: string
}

export function UserInfo({ userInfos }: UserInfoProps) {
  const [info, setInfo] = useState<friend | undefined>(undefined)
  const params = useParams<UserInfoParams>()
  useEffect(() => {
    setInfo(userInfos?.find(userInfo => userInfo.id == parseInt(params.id)))
  }, [params])

  return (
    <div className="user-info-container">
      <div className="user-info box-top-column expand">
        <div className="profile-image">
          <i className="fas fa-user"></i>
        </div>
        <div className="name">{info?.name}</div>
        <div className="regiment">Type에 소속이 없습니다.</div>
        <div className="info-category">연락처</div>
        <div className="info-wrapper">
          <div className="info-title">휴대폰</div>
          <div className="info-content">{info?.phone_number}</div>
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
    </div>
  )
}

type CounselLogProps = {
  text: string
  timestamp: string
  myLog: boolean
}

export function CounselLog({ text, timestamp, myLog }: CounselLogProps) {
  // 여기서 opponent라는 말을 써야하나 키워드 정리부터
  return (
    <div className={`counsel-log ${myLog ? 'myLog' : 'opponentLog'}`}>
      <div className="wrapper">
        <div className="text">{text}</div>
        <div className="timestamp">{timestamp}</div>
      </div>
      {!myLog && (
        <div className="profile-image">
          <i className="fas fa-user"></i>
        </div>
      )}
    </div>
  )
}

type CurrentCounselRoomProps = {
  toggleToolbox: () => void
  user: User | null
  toolbox: boolean
}

export function CurrentCounselRoom({ toggleToolbox, user, toolbox }: CurrentCounselRoomProps) {
  const [counselLogs, setCounselLogs] = useState<CounselLogProps[]>([])

  useEffect(() => {
    scrollToBottom()
    setCounselLogs([
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
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [counselLogs])
  // 채팅내역을 로드할 수 있는 API가 필요합니다. (채팅방 id)

  function scrollToBottom() {
    let counselLogs = document.getElementById('counsel-logs')
    if (counselLogs) {
      counselLogs.scrollTop = counselLogs.scrollHeight
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
    setCounselLogs([
      ...counselLogs, //기존 채팅로그
      {
        text: message,
        timestamp: getTimestamp(),
        myLog: true
      }
    ])
  }

  function handleToolboxClick() {
    toggleToolbox()
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement> & { target: { message: HTMLInputElement } }
  ) {
    e.preventDefault()
    let message = e.target.message.value
    if (message) {
      addMessage(message)
    }
    e.target.message.value = ''
  }
  return (
    <div className="current-counselroom">
      <div className="current-counselroom-header">
        {user?.authority == 3 && (
          <button className="letter" onClick={handleToolboxClick}>
            상담도구 {toolbox ? '넣기' : '꺼내기'}
          </button>
        )}
        <button className="letter">상담 종료하기</button>
      </div>
      <div className="counsel-logs" id="counsel-logs">
        <div className="counsel-log-null"></div>
        {counselLogs &&
          counselLogs.map((value, key) => {
            return (
              <CounselLog
                key={key}
                text={value.text}
                timestamp={value.timestamp}
                myLog={value.myLog}
              />
            )
          })}
        <div className="counsel-log-null"></div>
      </div>
      <form className="counsel-input" onSubmit={handleSubmit}>
        <div className="box-center expand">
          <div className="attachment">
            <i className="fas fa-paperclip"></i>
          </div>
        </div>
        <input name="message" placeholder="대화를 입력하세요." />
        <button className="counsel-send">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  )
}

type CounselRoomListProps = {
  rooms: counselRoom[]
}

export function CounselRoomList({ rooms }: CounselRoomListProps) {
  //현재 사용자가 열람할 수 있는 모든 채팅방을 가져올 수 있는 API가 필요합니다.

  return (
    <div className="counselroom-list">
      {rooms.map((room, index) => {
        return (
          <NavLink
            key={index}
            to={`/counsel/counselrooms/${room.id}`}
            className="counselroom"
            activeClassName="selected">
            <div className="profile-image">
              <i className="fas fa-user"></i>
            </div>
            <div className="wrapper">
              <div className="name">
                {room.friend.name} {parseAuthority(room.friend.authority)}
              </div>
              <span className="last-message">{room.last_message.text}</span>
              <span className="last-message-time">
                {room.last_message.timestamp.getDate()}
              </span>{' '}
              {/** Format을 맞춰줘야 합니다 */}
            </div>
          </NavLink>
        )
      })}
    </div>
  )
}

type FriendListProps = {
  friends: friend[]
}
export function FriendList({ friends }: FriendListProps) {
  return (
    <div className="friend-list">
      {friends.map((friend, index) => {
        return (
          <NavLink
            key={index}
            to={`/counsel/friends/${friend.id}`}
            className="friend"
            activeClassName="selected">
            <span className="profile-image"></span>
            <span className="friend-name">
              {friend.name} {parseAuthority(friend.authority)}
            </span>
          </NavLink>
        )
      })}
    </div>
  )
}

type CounselProps = {
  user: User | null
}

type CounselParams = {
  id: string
}

export default function Counsel({ user }: CounselProps) {
  type CounselData = {
    rooms: counselRoom[]
    friends: friend[]
  }
  const [rooms, setRooms] = useState<counselRoom[]>([])
  const [friends, setFriends] = useState<friend[]>([])
  const [toolbox, setToolbox] = useState<boolean>(false)

  function getFriends() {
    let friendsData = database.API_COUNSEL_FRIENDS
    return friendsData
  }
  function getRooms() {
    let roomsData = database.API_COUNSEL_ROOMS
    return roomsData
  }
  function toggleToolbox() {
    setToolbox(toolbox => !toolbox)
  }

  useEffect(() => {
    setFriends(getFriends())
    setRooms(getRooms())
  }, [])

  return (
    <div className="box-left expand">
      <div className="counsel">
        <div className="counsel-navbar">
          <div className="profile-image-area">
            <div className="profile-image">
              <i className="fas fa-user"></i>
            </div>
          </div>
          <ul>
            <NavLink to="/counsel/counselrooms" activeClassName="selected">
              <li>
                <i className="fas fa-comment-alt"></i>
              </li>
            </NavLink>
            <NavLink to="/counsel/friends" activeClassName="selected">
              <li>
                <i className="fas fa-users"></i>
              </li>
            </NavLink>
          </ul>
        </div>
        <div className="counsel-navbar-content">
          <div className="counsel-search">
            <div className="counsel-search-input">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="검색"></input>
            </div>
          </div>
          <Switch>
            <Redirect exact path="/counsel" to="/counsel/counselrooms" />{' '}
            {/** /counsel/counselrooms 를 기본 페이지로 설정하기 위함. */}
            <Route path="/counsel/counselrooms">
              <CounselRoomList rooms={rooms} />
            </Route>
            <Route path="/counsel/friends">
              <FriendList friends={friends} />
            </Route>
          </Switch>
        </div>
        <Route path={['/counsel/counselrooms/:id', '/counsel/friends/:id']}>
          <div className="counsel-content">
            <Route path="/counsel/friends/:id">
              <UserInfo userInfos={friends} />
            </Route>
            <Route path="/counsel/counselrooms/:id">
              {toolbox && user?.authority == 3 ? <Toolbox /> : <UserInfo userInfos={friends} />}
              <CurrentCounselRoom user={user} toolbox={toolbox} toggleToolbox={toggleToolbox} />
            </Route>
          </div>
        </Route>
      </div>
    </div>
  )
}
