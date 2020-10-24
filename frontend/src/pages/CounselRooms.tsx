import React, { useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { GlobalData } from '../App'

type CounselroomProps = {
  id: number
  globalData: GlobalData
}

function Counselroom({ id, globalData }: CounselroomProps) {
  function handleClick() {
    globalData.changeCurrentRoom(id)
  }

  function handleProfileOpen() {
    globalData.changeProfile(id)
  }
  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">김현우 상담관</div>
        <div className="last_message">어떤 고민이 있나요??</div>
      </div>
      <div className="more">
        <div className="timestamp">10분전</div>
        <MenuDropdown>
          <Option>상담방 열기</Option>
          <Option hr onClick={handleProfileOpen}>
            프로필 보기
          </Option>
          <Option colored>상담방 나가기</Option>
        </MenuDropdown>
      </div>
    </div>
  )
}

type PageCounselroomsProps = {
  globalData: GlobalData
}

export default function PageCounselrooms({ globalData }: PageCounselroomsProps) {
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
        <Counselroom id={111} globalData={globalData} />
        <Counselroom id={222} globalData={globalData} />
        <Counselroom id={333} globalData={globalData} />
      </div>
    </div>
  )
}
