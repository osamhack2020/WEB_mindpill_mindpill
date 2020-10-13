import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Manage() {
  return (
    <div className="box-left expand">
      <div className="manage">
        <div className="manage-navbar">
          <ul>
            <NavLink to="/manage/users" activeClassName="selected">
              <li>
                <i className="fas fa-user-cog"></i>
                <span>회원관리</span>
              </li>
            </NavLink>
            <NavLink to="/manage/counselors" activeClassName="selected">
              <li>
                <i className="fas fa-cogs"></i>
                <span>신규관리</span>
              </li>
            </NavLink>
          </ul>
        </div>
        <div className="manage-content">
          <div className="manage-content-search">
            <div className="manage-search-input">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="검색어를 입력하세요" />
            </div>
          </div>
          <div className="title">안보지원사령부 701부대</div>
          <table className="manage-table">
            <th>
              <tr>
                <td>#</td>
                <td>군번</td>
                <td>이메일</td>
                <td>이름</td>
                <td>분류</td>
                <td>전화번호</td>
              </tr>
            </th>
            <tbody>
              <tr>
                <td>1</td>
                <td>19-43027982</td>
                <td>clo3olb@gmail.com</td>
                <td>김현우</td>
                <td>육군</td>
                <td>010-1234-5678</td>
              </tr>
              <tr>
                <td>2</td>
                <td>19-43027982</td>
                <td>clo3olb@gmail.com</td>
                <td>김현우</td>
                <td>육군</td>
                <td>010-1234-5678</td>
              </tr>
              <tr>
                <td>3</td>
                <td>19-43027982</td>
                <td>clo3olb@gmail.com</td>
                <td>김현우</td>
                <td>육군</td>
                <td>010-1234-5678</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
