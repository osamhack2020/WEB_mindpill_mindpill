import React from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { parseAuthority, User } from '../routes'

type FriendProps = {
  id: number
  changeSub: (id: number) => void
}

function Friend({ id, changeSub }: FriendProps) {
  function handleClick() {
    changeSub(id)
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

type PageFriendsProps = {
  user: User | null
  changeSub: (id: number) => void
}

export default function PageFriends({ user, changeSub }: PageFriendsProps) {
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
        <Friend id={4444} changeSub={changeSub} />
      </div>
    </div>
  )
}
