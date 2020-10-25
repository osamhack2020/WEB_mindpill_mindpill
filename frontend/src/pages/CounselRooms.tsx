import React, { useEffect, useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../states'
import { Room } from '../types'

type CounselRoomProps = {
  roomInfo: Room
}

function CounselRoom({ roomInfo }: CounselRoomProps) {
  const [state, dispatch] = useTracked()

  function handleClick() {
    dispatch({ type: 'SET_CURRENT_ROOM_ID', currentRoomId: roomInfo.id })
    dispatch({ type: 'SET_SUB_PAGE', subPage: 'COUNSEL_ROOM' })
  }

  function handleProfileOpen() {
    dispatch({ type: 'SET_PROFILE_ID', profileId: roomInfo.opponent.id })
  }

  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">{roomInfo.opponent.name}</div>
        <div className="last_message">{roomInfo.lastMessage.message}</div>
      </div>
      <div className="more">
        <div className="timestamp">{roomInfo.lastMessage.timestamp}</div>
        <MenuDropdown>
          <Option onClick={handleClick}>상담방 열기</Option>
          <Option onClick={handleProfileOpen}>프로필 보기</Option>
        </MenuDropdown>
      </div>
    </div>
  )
}

export default function PageCounselrooms() {
  const [rooms, setRooms] = useState<Room[]>([])

  function getRooms() {
    //가상으로 만들어진 정보입니다. 후에 API를 연결해야 합니다.
    const roomsList = [
      {
        id: 10,
        lastMessage: {
          message: '무슨일이 있나요?',
          timestamp: '10분전' // string 이 아닌 Date 타입일 수 있습니다.
        },
        opponent: {
          id: 10,
          name: '김현우 상담관'
        }
      }
    ]
    return roomsList
  }

  useEffect(() => {
    setRooms(getRooms())
  }, [])

  return (
    <div id="page_counselrooms" className="page_template">
      <div className="header">
        <div className="title">상담방</div>
        <div className="search">
          <i className="fas fa-search"></i>
          <input name="search" placeholder="상담방을 검색하세요." />
        </div>
      </div>
      <div className="item_list">
        {rooms.map((room, index) => (
          <CounselRoom roomInfo={room} key={index} />
        ))}
      </div>
    </div>
  )
}
