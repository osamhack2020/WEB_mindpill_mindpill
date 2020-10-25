import React, { useEffect, useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../state'
import { User as UserType } from '../types'

type FriendProps = {
  user: UserType
}

function Friend({ user }: FriendProps) {
  const [state, dispatch] = useTracked()

  function handleClick() {
    dispatch({ type: 'SET_CURRENT_ROOM_ID', currentRoomId: 0 }) // user와 대응되는 CounselRoom 정보를 받아온 후에 개선해야합니다.
    dispatch({ type: 'SET_SUB_PAGE', subPage: 'COUNSEL_ROOM' })
  }
  function handleProfileOpen() {
    dispatch({ type: 'SET_PROFILE_ID', profileId: user.id })
  }
  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">{user.name}</div>
        <div className="user_detail">user Type에 소속이 추가되어야 합니다.</div>
      </div>
      <div className="more">
        <MenuDropdown>
          <Option>상담 시작하기</Option>
          <Option onClick={handleProfileOpen}>프로필 보기</Option>
        </MenuDropdown>
      </div>
    </div>
  )
}

export default function PageFriends() {
  const [friends, setFriends] = useState<UserType[]>([])

  function getFriends() {
    //가상 정보입니다. API와 연동이 필요합니다.
    const fakeFriends = [
      {
        id: 10,
        name: '김현우'
      }
    ]
    return fakeFriends
  }

  useEffect(() => {
    setFriends(getFriends())
  }, [])
  return (
    <div id="page_friends" className="page_template">
      <div className="header">
        <div className="title">상담관</div>
        <div className="search">
          <i className="fas fa-search"></i>
          <input name="search" placeholder="상담관을 검색하세요." />
        </div>
      </div>
      <div className="item_list">
        {friends.map((friend, index) => (
          <Friend user={friend} key={index} />
        ))}
      </div>
    </div>
  )
}
