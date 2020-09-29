import React from 'react';
import { Link } from 'react-router-dom';

class Layout extends React.Component {

    render() {
        return (
            <div className='app-container'>
                <div className='header'>
                    <Link to='/' className='logo'>
                        Mind Pill
                    </Link>
                </div>
                <div className='content-container'>
                    <div className='navbar'>
                        <ul>
                            <Link to='/login'>
                                <li>로그인</li>
                            </Link>
                            <Link to='/join'>
                                <li>회원가입</li>
                            </Link>
                            <Link to='/chat'>
                                <li>상담하기</li>
                            </Link>
                            <Link to='/'>
                                <li>내정보</li>
                            </Link>
                        </ul>
                        <ul>
                            <Link to='/login/hello'>
                                <li>설정</li>
                            </Link>
                            <Link to='/join/hello'>
                                <li>지원</li>
                            </Link>
                            <Link to='/'>
                                <li>로그아웃</li>
                            </Link>
                        </ul>
                    </div>
                    <div className='content box-center'>
                        {this.props.children}
                    </div>
                </div>

            </div>
        )
    }
}

export default Layout;
