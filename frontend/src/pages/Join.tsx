import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type JoinQuery = {
  email: string
  password: string
  name: string
  sv_number: string
  gender: 'm' | 'f'
  phone_number: string
  rank_id: number
  group_id: number
}

export default function Join() {
  const [popup, setPopup] = useState<boolean>(false)
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (e.currentTarget.password.value == e.currentTarget.password2.value) {
      let query: JoinQuery = {
        name: e.currentTarget.userName.value,
        email: e.currentTarget.email.value,
        gender: e.currentTarget.gender.value,
        password: e.currentTarget.password.value,
        sv_number: e.currentTarget.sv_number.value,
        phone_number: e.currentTarget.phone_number.value,
        //rank_id: parseInt(e.currentTarget.rank_id.value),
        rank_id: 1,
        //group_id: parseInt(e.currentTarget.group_id.value)
        group_id: 1
      }
      createUser(query)
    } else {
      console.log('비밀번호가 일치하지 않습니다.')
    }
  }

  function createUser(query: JoinQuery) {
    axios({
      method: 'post',
      url: '/api/create_user',
      data: query
    })
      .then(response => {
        const { status, statusText, data } = response
        if (status == 200 && statusText == 'OK') {
          setJoinSuccess(true)
          setPopup(true)
        }
        console.log({ response })
        // accessToken을 localStorage, cookie 등에 저장하지 않는다!
      })
      .catch(error => {
        setPopup(true)
        console.log(error)
      })
  }

  function handleDismiss() {
    setPopup(false)
  }

  return (
    <div id="page_join">
      <div id="page_join_content">
        <div className="greetings">
          마인드필에 오신 것을 <br />
          환영합니다!
        </div>
        <form id="form_join" onSubmit={handleSubmit}>
          <input className="styled sized" name="userName" type="text" placeholder="이름" autoFocus required />
          <input className="styled sized" name="email" type="email" placeholder="이메일" required />

          <select name="gender" className="styled sized" defaultValue="">
            <option value="" disabled>
              성별을 선택해주세요.
            </option>
            <option value="m">남성</option>
            <option value="f">여성</option>
          </select>

          <input className="styled sized" name="password" type="password" placeholder="비밀번호" required />
          <input className="styled sized" name="password2" type="password" placeholder="비밀번호 확인" required />

          <select name="rank_id" className="styled sized" defaultValue="">
            <option value="" disabled>
              계급/등급을 선택해주세요.
            </option>
            <option value="2">이등병</option>
            <option value="3">일병</option>
            <option value="4">상병</option>
            <option value="5">병장</option>
          </select>

          <input className="styled sized" name="phone_number" type="text" placeholder="전화번호" required />
          <input className="styled sized" name="sv_number" type="text" placeholder="군번" required />
          {/**소속 검색해서 팝업 띄워야함 */}
          <input className="styled sized" name="group_id" type="text" placeholder="소속을 검색하세요" required />

          <input className="styled sized black" type="submit" value="회원가입" />
        </form>
        <Link to="/login" className="login">
          <p>이미 회원이신가요?</p>
        </Link>
      </div>

      <div className={`popup_container ${popup && 'on'}`}>
        <div className="popup">
          {joinSuccess ? (
            <>
              <i className="fas fa-check-circle icon success"></i>
              <div className="message">회원가입이 완료되었습니다.</div>
              <Link to="/login">
                <button className="styled sized black">
                  <i className="fas fa-sign-in-alt"></i> &nbsp; 로그인
                </button>
              </Link>
            </>
          ) : (
            <>
              <i className="fas fa-exclamation-triangle icon error"></i>
              <div className="message">정보를 수정해주세요.</div>
              <button className="styled sized black" onClick={handleDismiss}>
                <i className="fas fa-undo-alt"></i> &nbsp; 수정하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
