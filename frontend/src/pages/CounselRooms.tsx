import React, { useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../state'

type CounselroomProps = {
  id: number
}

function Counselroom({ id }: CounselroomProps) {
  const [state, dispatch] = useTracked()

  function handleClick() {
    dispatch({ type: 'SET_CURRENT_ROOM_ID', currentRoomId: id })
  }

  function handleProfileOpen() {
    dispatch({ type: 'SET_PROFILE_ID', profileId: id }) // 여기서의 id 는 currentRoomId와 같은 것을 사용하고 있습니다. 수정이 필요합니다.
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

export default function PageCounselrooms() {
  const [state, dispatch] = useTracked()
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
        <Counselroom id={111} />
        <Counselroom id={222} />
        <Counselroom id={333} />
      </div>
    </div>
  )
}
