import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { User } from '../routes'

type JoinProps = {
  user: User | null
}

export default function Join({ user }: JoinProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let query = {
      name: e.currentTarget.name.value,
      email: e.currentTarget.email.value,
      gender: e.currentTarget.gender.value,
      password: e.currentTarget.password.value,
      password2: e.currentTarget.password2.value,
      serialNo: e.currentTarget.serialNo.value,
      rank: e.currentTarget.rank.value,
      //classification: e.currentTarget.classification.value,
      department: e.currentTarget.department.value,
      regiment: e.currentTarget.regiment.value
    }
    console.log(query)
  }

  function createUser() {
    axios({
      method: 'post',
      url: '/api/create_user',
      data: {
        email: 'recipient@example.com',
        password: '1q2w3e4r!',
        name: 'Example',
        sv_number: '00-00000000',
        gender: 'm',
        phone_number: '000-0000',
        rank_id: 0,
        group_id: 0
      }
    })
      .then(response => {
        const { user_id } = response.data
        console.log(user_id)
        // accessToken을 localStorage, cookie 등에 저장하지 않는다!
      })
      .catch(error => {
        console.log(error)
      })
  }

  createUser()
  return (
    <div id="page_join">
      <div className="greetings">
        마인드필에 오신 것을 <br />
        환영합니다!
      </div>
      <form id="form_join" onSubmit={handleSubmit}>
        <input className="styled sized" name="name" type="text" placeholder="이름" autoFocus required />
        <input className="styled sized" name="email" type="email" placeholder="이메일" required />

        <select name="gender" className="styled sized">
          <option value="" disabled selected>
            성별을 선택해주세요.
          </option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <input className="styled sized" name="password" type="password" placeholder="비밀번호" required />
        <input className="styled sized" name="password2" type="password" placeholder="비밀번호 확인" required />

        <select name="department" className="styled sized">
          <option value="" disabled selected>
            군 구분을 선택해주세요.
          </option>
          <option value="국방부">국방부</option>
          <option value="국방부 직할부대">직할부대</option>
          <option value="육군">육군</option>
          <option value="해군">해군</option>
          <option value="해병대">해병대</option>
          <option value="공군">공군</option>
          <option value="생도">생도</option>
          <option value="후보생">후보생</option>
          <option value="군무원">군무원</option>
        </select>
        <select name="rank" className="styled sized">
          <option value="" disabled selected>
            계급/등급을 선택해주세요.
          </option>
          <option value="이등병">이등병</option>
          <option value="일병">일병</option>
          <option value="상병">상병</option>
          <option value="병장">병장</option>
        </select>

        <input className="styled sized" name="serialNo" type="text" placeholder="군번" required />
        {/**소속 검색해서 팝업 띄워야함 */}
        <input className="styled sized" name="regiment" type="text" placeholder="소속을 검색하세요" required />

        <input className="styled sized black" type="submit" value="회원가입" />
      </form>
      <Link to="/login" className="login">
        <p>이미 회원이신가요?</p>
      </Link>
    </div>
  )
}
