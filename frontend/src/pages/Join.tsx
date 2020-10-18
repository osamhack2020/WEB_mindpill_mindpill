import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import SelectBox from '../components/SelectBox'
import SelectBySearch from '../components/SelectBySearch'
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
      classification: e.currentTarget.classification.value,
      department: e.currentTarget.department.value,
      regiment: e.currentTarget.regiment.value
    }
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
    <div className="box-center-column">
      <form className="box-center-column" id="form-join" onSubmit={handleSubmit}>
        <div className="box-center">
          <div className="box-top-column mg-hr">
            <label>이름</label>
            <Input name="name" type="text" placeholder="이름" required autofocus />
            <label>이메일</label>
            <Input name="email" type="email" placeholder="이메일" required />
            <label>성별</label>
            <SelectBox name="gender" placeholder="성별" values={['남자', '여자']} required />
            <label>비밀번호</label>
            <Input
              name="password"
              type="password"
              placeholder="비밀번호"
              helperMessage="영문, 숫자, 특수기호를 반드시 포함해야 하며, 8글자 이상이여야 합니다."
              required
            />
            <label>비밀번호 확인</label>
            <Input name="password2" type="password" placeholder="비밀번호 확인" required />
          </div>
          <div className="box-top-column">
            <label>소속</label>
            <SelectBySearch
              name="regiment"
              placeholder="소속을 검색하세요"
              values={['1사단', '2사단', '지상작전사령부', '안보지원사령부']}
              required
            />
            <label>군 구분</label>
            <SelectBox
              name="department"
              placeholder="군 구분"
              values={['국방부', '국방부 직할부대', '육군', '해군', '해병대', '공군', '생도', '후보생', '군무원']}
              required
            />
            <label>계급/등급</label>
            <SelectBox name="rank" placeholder="계급/등급" values={['이등병', '일병', '상병', '병장', '하사', '중사']} required />
            <label>군번</label>
            <Input name="serialNo" type="text" placeholder="군번" required />
            <label>회원분류</label>
            <SelectBox name="classification" placeholder="회원분류" values={['부대 관리자', '지휘관', '상담관', '일반']} required />
          </div>
        </div>
        <Input type="submit" value="회원가입" />
      </form>
      <Link to="/login">
        <p>이미 회원이신가요?</p>
      </Link>
    </div>
  )
}
