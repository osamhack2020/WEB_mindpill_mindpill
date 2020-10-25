import React, { useEffect, useState } from 'react'
import { MenuDropdown, Option } from '../components/MenuDropdown'
import { useTracked } from '../state'
import { User as UserType } from '../types'

type UserProps = {
  user: UserType
}

function User({ user }: UserProps) {
  const [state, dispatch] = useTracked()

  function handleProfileOpen() {
    dispatch({ type: 'SET_PROFILE_ID', profileId: user.id })
  }

  function handleClick() {}
  return (
    <div className="item" onClick={handleClick}>
      <div className="profile_image"></div>
      <div className="info">
        <div className="user_name">{user.name}</div>
        <div className="user_detail">소속의 type을 설정해야 합니다.</div>
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
  const [users, setUsers] = useState<UserType[] | undefined>([])

  function getUsers() {
    //가상 정보입니다. API와 연동해야 합니다.
    const fakeUsers = [
      {
        id: 10,
        name: '김현우'
      }
    ]
    return fakeUsers
  }

  useEffect(() => {
    setUsers(getUsers())
  }, [])
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
        {users?.map((user, index) => (
          <User user={user} key={index} />
        ))}
      </div>
    </div>
  )
}
