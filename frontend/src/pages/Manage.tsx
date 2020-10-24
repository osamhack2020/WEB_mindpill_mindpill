import React, { useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../state'

type ManageItemProps = {
  id: number
}

function ManageItem({ id }: ManageItemProps) {
  const [state, dispatch] = useTracked()

  function handleProfileOpen() {
    dispatch({ type: 'SET_PROFILE_ID', profileId: id })
  }
  function handleClick() {}
  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">김현우</div>
        <div className="user_detail">00연대 00중대 상담관</div>
      </div>
      <div className="more">
        <MenuDropdown>
          <Option hr onClick={handleProfileOpen}>
            프로필 보기
          </Option>
          <Option colored>사용자 삭제</Option>
        </MenuDropdown>
      </div>
    </div>
  )
}

export default function PageManage() {
  return (
    <div id="page_counselrooms" className="page_template">
      <div className="header">
        <div className="title">부대관리</div>
        <div className="search">
          <i className="fas fa-search"></i>
          <input name="search" placeholder="사용자를 검색하세요." />
        </div>
      </div>
      <div className="item_list">
        <ManageItem id={111} />
        <ManageItem id={222} />
        <ManageItem id={333} />
      </div>
    </div>
  )
}
