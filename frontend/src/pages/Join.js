import React from 'react'
import { Link } from 'react-router-dom';
import SelectBox from '../components/SelectBox';


class Join extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, gender, password, password2, serialNo, rank, regiment, classification, department } = e.target;
        const query = {
            name: name.value,
            email: email.value,
            gender: gender.value,
            password: password.value,
            password2: password2.value,
            serialNo: serialNo.value,
            rank: rank.value, 
            regiment: regiment.value , 
            classification: classification.value, 
            department: department.value,
        }
        console.log(query);
    }

    render() {
        return (
            <div className='box-center-column'>
                <form className='form-join box-center-column' onSubmit={this.handleSubmit}>
                    <div className='box-top'>
                        <div className='mg-hr'>
                            <input name='name' type='text' placeholder='이름' />
                            <input name='email' type='email' placeholder='이메일' />
                            <SelectBox name='gender' placeholder='성별' values={['남자', '여자']} />
                            <input name='password' type='password' placeholder='비밀번호' />
                            <input name='password2' type='password' placeholder='비밀번호 확인' />
                            
                        </div>
                        <div className='mg-hr'>
                            <input name='serialNo' type='text' placeholder='군번' />
                            <SelectBox name='rank' placeholder='계급/등급' values={['이등병', '일병', '상병', '병장', '하사', '중사']}/>
                            <SelectBox name='regiment' placeholder='소속' values={['1사단', '2사단 12중대', '안보지원사령부']}/>
                            <SelectBox name='classification' placeholder='회원분류' values={['부대 관리자', '지휘관', '상담관', '일반']}/>
                            <SelectBox name='department' placeholder='군 구분' values={['국방부', '국방부 직할부대', '육군', '해군', '해병대', '공군', '생도', '후보생', '군무원']}/>
                        </div>
                    </div>
                    <input type='submit' value='회원가입' />
                    
                </form>
                <Link to='/login'>
                    <p>이미 회원이신가요?</p>
                </Link>
            </div>
        )
    }
}

export default Join;
