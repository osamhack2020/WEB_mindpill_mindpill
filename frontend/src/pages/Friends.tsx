import React from 'react'
import { parseAuthority, User } from '../routes'

function Friend() {
  return (
    <div className="item">
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">김현우 상담관</div>
        <div className="user_detail">12중대 12연대 상담관</div>
      </div>
      <div className="menu">
        <i className="fas fa-ellipsis-h"></i>
      </div>
    </div>
  )
}

type FriendsProps = {
  user: User | null
}

export default function PageFriends({ user }: FriendsProps) {
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
        <Friend />
      </div>
    </div>
  )
}
