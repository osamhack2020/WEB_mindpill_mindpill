import React from 'react'
import Layout from './Layout';
import { Link } from 'react-router-dom';
import SelectBox from '../components/SelectBox';


class Join extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.querySelectorAll('input'));
    }

    render() {
        return (
            <Layout>
                <div className='box-center-column'>
                    <form className='form-join box-center-column' onSubmit={this.handleSubmit}>
                        <div className='box-top'>
                            <div className='mg-hr'>
                                <input type='text' placeholder='이름' name='name' required />
                                <input type='email' placeholder='이메일' name='email' required />
                                <SelectBox name='gender' placeholder='성별' values={['남자', '여자']} />
                                <input type='password' placeholder='비밀번호' name='password' required />
                                <input type='password' placeholder='비밀번호 확인' name='password2' required />
                                
                            </div>
                            <div className='mg-hr'>
                                <input type='text' placeholder='군번' name='serialNo' required />
                                <SelectBox name='rank' placeholder='계급' values={['이등병', '일병', '상병', '병장', '하사', '중사']}/>
                                <SelectBox name='regiment' placeholder='소속' values={['1', '2', '3', '4', '5', '6']}/>
                            </div>
                        </div>
                        <input type='submit' value='회원가입' />
                        
                    </form>
                    <Link to='/login'>
                        <p>이미 회원이신가요?</p>
                    </Link>
                </div>
            </Layout>
        )
    }
}

export default Join;
