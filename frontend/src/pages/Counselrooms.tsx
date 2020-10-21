import React from 'react'
import { parseAuthority, User } from '../routes'

function Counselroom() {
  return (
    <div className="item">
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">김현우 상담관</div>
        <div className="last_message">어떤 고민이 있나요??</div>
      </div>
      <div className="menu">
        <div className="timestamp">10분전</div>
        <i className="fas fa-ellipsis-h"></i>
      </div>
    </div>
  )
}

type CounselroomsProps = {
  user: User | null
}

export default function PageCounselrooms({ user }: CounselroomsProps) {
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
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
        <Counselroom />
      </div>
    </div>
  )
}
