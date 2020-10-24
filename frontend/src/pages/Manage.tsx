import React, { useState } from 'react'
import { NavLink, Redirect, Route } from 'react-router-dom'
import { GlobalData } from '../App'
import { parseAuthority } from '../routes'
import database from '../tempDatabase'

function RecordTable() {
  return (
    <table className="manage-table manage-user">
      <thead>
        <tr>
          {['#', '상담관', '피상담자', '시간', '메세지'].map((title, index) => (
            <td key={index}>{title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {database.API_MANAGE_RECORD.map((record, index) => (
          <tr key={index + 1}>
            <td>{index + 1}</td>
            <td>{record.counselor}</td>
            <td>{record.user}</td>
            <td>{record.date}</td>
            <td>
              {record.message_id && (
                <button className="letter">
                  <i className="fas fa-comment-dots"></i>
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function NewTable() {
  return (
    <table className="manage-table">
      <thead>
        <tr>
          {['#', '군번', '이메일', '이름', '분류', '전화번호', ''].map((title, index) => (
            <td key={index}>{title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {database.API_MANAGE_NEW.map((user, index) => (
          <tr key={index + 1}>
            <td>{index + 1}</td>
            <td>{user.sv_number}</td>
            <td>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.classification}</td>
            <td>{user.phone_number}</td>
            <td>
              <button className="letter">승인</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type right_sidebarSelectProps = {
  values: number[]
  defaultValue: number
}

function SlideSelect({ values, defaultValue }: SlideSelectProps) {
  const [chosenValue, setChosenValue] = useState<number>(values.indexOf(defaultValue))
  // chosenValue 는 values 배열에서 위치를 나타냅니다.
  function handleLeftClick() {
    if (chosenValue - 1 < 0) {
      setChosenValue(values.length - 1)
    } else {
      setChosenValue(chosenValue => chosenValue - 1)
    }
  }
  function handleRightClick() {
    if (chosenValue + 1 > values.length - 1) {
      setChosenValue(0)
    } else {
      setChosenValue(chosenValue => chosenValue + 1)
    }
  }

  return (
    <div className="slide-select">
      <button onClick={handleLeftClick}>
        <i className="fas fa-caret-left"></i>
      </button>
      <div className="value">{parseAuthority(values[chosenValue])}</div>
      <button onClick={handleRightClick}>
        <i className="fas fa-caret-right"></i>
      </button>
    </div>
  )
}

type UserTableRowProps = {
  user: {
    sv_number: string
    email: string
    name: string
    classification: string
    phone_number: string
    authority: number
  }
  index: number
}
function UserTableRow({ user, index }: UserTableRowProps) {
  const [changeAuthority, setChangeAuthority] = useState<boolean>(false)

  function toggleChangeAuthority() {
    setChangeAuthority(changeAuthority => !changeAuthority)
  }

  return (
    <tr>
      <td>{index}</td>
      <td>{user.sv_number}</td>
      <td>{user.email}</td>
      <td>{user.name}</td>
      <td>{user.classification}</td>
      <td>{user.phone_number}</td>
      <td className="authority">
        {changeAuthority ? <SlideSelect values={[3, 4, 5]} defaultValue={user.authority} /> : parseAuthority(user.authority)}
      </td>
      <td className={`hover ${changeAuthority && 'changing'}`}>
        <button className="letter" onClick={toggleChangeAuthority}>
          {changeAuthority ? '저장' : '등급변경'}
        </button>
      </td>
    </tr>
  )
}

function UserTable() {
  return (
    <table className="manage-table manage-user">
      <thead>
        <tr>
          {['#', '군번', '이메일', '이름', '분류', '전화번호', '등급'].map((title, index) => (
            <td key={index}>{title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {database.API_MANAGE_USER.map((user, index) => (
          <UserTableRow user={user} index={index + 1} key={index} />
        ))}
      </tbody>
    </table>
  )
}

type ManageProps = {
  globalData: GlobalData
}

export default function Manage({ globalData }: ManageProps) {
  return (
    <div className="box-left expand">
      <div className="manage">
        <div className="manage-navbar">
          <ul>
            <li className="navbar-icon">
              <i className="fas fa-tasks"></i>
            </li>
            {(globalData.user?.authority == 1 || globalData.user?.authority == 2) && (
              <>
                <NavLink to="/manage/user" activeClassName="selected">
                  <li>
                    <i className="fas fa-user-cog"></i>
                    <span>회원관리</span>
                  </li>
                </NavLink>
                <NavLink to="/manage/new" activeClassName="selected">
                  <li>
                    <i className="fas fa-cogs"></i>
                    <span>신규관리</span>
                  </li>
                </NavLink>{' '}
              </>
            )}
            {(globalData.user?.authority == 3 || globalData.user?.authority == 4) && (
              <NavLink to="/manage/record" activeClassName="selected">
                <li>
                  <i className="fas fa-clipboard"></i>
                  <span>상담기록</span>
                </li>
              </NavLink>
            )}
          </ul>
        </div>
        <div className="manage-content">
          <div className="title">부대이름 표시영역</div>
          <div className="manage-content-search">
            <div className="manage-search-input">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="검색어를 입력하세요" />
            </div>
          </div>
          {(globalData.user?.authority == 1 || globalData.user?.authority == 2) && (
            <>
              <Redirect exact from="/manage" to="/manage/user" />
              <Route path="/manage/user">
                <UserTable />
              </Route>
              <Route path="/manage/new">
                <NewTable />
              </Route>
            </>
          )}
          {(globalData.user?.authority == 3 || globalData.user?.authority == 4) && (
            <>
              <Redirect exact from="/manage" to="/manage/record" />
              <Route path="/manage/record">
                <RecordTable />
              </Route>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
