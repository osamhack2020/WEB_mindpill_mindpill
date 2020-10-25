import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GlobalData } from '../App'

type JoinProps = {
  globalData: GlobalData
}

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

export default function Join({ globalData }: JoinProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (e.currentTarget.password.value == e.currentTarget.password2.value) {
      /**
        name: 'Example',
        email: 'recipient@example.com',
        password: '1q2w3e4r!',
        sv_number: '00-00000000',
        gender: 'm',
        phone_number: '000-0000',
        rank_id: 1,
        group_id: 0
       */

      let query: JoinQuery = {
        name: e.currentTarget.name.value,
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
        const { status, data } = response
        console.log({ response })
        // accessToken을 localStorage, cookie 등에 저장하지 않는다!
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div id="page_join">
      <div className="greetings">
        마인드필에 오신 것을 <br />
        환영합니다!
      </div>
      <form id="form_join" onSubmit={handleSubmit}>
        <input className="styled sized" name="name" type="text" placeholder="이름" autoFocus required />
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
  )
}
