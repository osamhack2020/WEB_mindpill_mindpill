import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Layout extends React.Component {

    render() {
        const {pathname} = this.props.location;
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
                            {/* 
                            {this.props.isLoggedIn 
                                ? 
                                    <>
                            */}
                                        <Link to='/chat' className={pathname === '/chat' ? 'selected' : undefined}>
                                            <li>상담하기</li>
                                        </Link>
                                        <Link to='/myInfo' className={pathname === '/myInfo' ? 'selected' : undefined}>
                                            <li>내정보</li>
                                        </Link>
                            {/* 
                                    </>
                                :
                                    <>
                            */}
                                        <Link to='/login' className={pathname === '/login' ? 'selected' : undefined}>
                                            <li>로그인</li>
                                        </Link>
                                        <Link to='/join' className={pathname === '/join' ? 'selected' : undefined}>
                                            <li>회원가입</li>
                                        </Link>
                            {/* 
                                    </>
                            }
                            */} 
                            
                            
                        </ul>
                        <ul>
                            <Link to='/setting' className={pathname === '/setting' ? 'selected' : undefined}>
                                <li>설정</li>
                            </Link>
                            <Link to='/support' className={pathname === '/support' ? 'selected' : undefined}>
                                <li>지원</li>
                            </Link>
                            <Link to='/logout'>
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

Layout.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
}

export default Layout;
