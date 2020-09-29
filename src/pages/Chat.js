import React from 'react'
import Layout from './Layout';

class ChatRoomList extends React.Component {
    render() {
        return (
            <div className='chatroom-list box-top-column expand'>
                        
            </div>
        )
    }
}

class ChatRoom extends React.Component {
    render() {
        return (
            <div className='chatroom expand'>
                <div className='chat-input'>
                    <div className='box-center expand'>
                        <div className='profile-image'></div>
                    </div>
                    <textarea type='text' placeholder='대화를 입력하세요.' rows='1'/>
                </div>
                
            </div>
        )
    }
}

class ChatRoomInfo extends React.Component {
    render() {
        return (
            <div>
                ChatRoomInfo
            </div>
        )
    }
}

class Chat extends React.Component {
    render() {
        return (
            <Layout>
                <div className='box-custom-1 expand'>
                    <ChatRoomList />
                    <ChatRoom />
                    <ChatRoomInfo />
                </div>
            </Layout>
        )
    }
}

export default Chat;
