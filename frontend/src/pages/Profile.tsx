import React from 'react'
import { GlobalData } from '../App'

type ProfileProps = {
  globalData: GlobalData
}

export default function Profile({ globalData }: ProfileProps) {
  function handleProfileOff() {
    globalData.changeProfile(0)
  }
  return (
    <div id="right_sidebar_profile">
      <button className="right_sidebar_off" onClick={handleProfileOff}>
        <i className="fas fa-times-circle"></i>
      </button>
      <div className="profile_image"></div>
      <div className="name">김현우 상담관</div>
      <div className="description">안녕하세요. 김현우 상담관입니다. 도움이 필요하시면 언제든지 말씀해주세요.</div>
      <div className="info_title">전화번호</div>
      <div className="info_content">010-9192-9527</div>
      <div className="info_title">이메일</div>
      <div className="info_content">clo3olb@gmail.com</div>
      <div className="info_title">소속 부대</div>
      <div className="info_content">00사단 00연대</div>
    </div>
  )
}
