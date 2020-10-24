import React from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../state'

type FriendProps = {
  id: number
}

function Friend({ id }: FriendProps) {
  const [state, dispatch] = useTracked()

  function handleClick() {
    dispatch({ type: 'SET_CURRENT_ROOM_ID', currentRoomId: id })
  }
  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">김현우 상담관</div>
        <div className="user_detail">12중대 12연대 상담관</div>
      </div>
      <div className="more">
        <MenuDropdown>
          <Option>상담 시작하기</Option>
          <Option>프로필 보기</Option>
        </MenuDropdown>
      </div>
    </div>
  )
}

export default function PageFriends() {
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
        <Friend id={4444} />
      </div>
    </div>
  )
}
