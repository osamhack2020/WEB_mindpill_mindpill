import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export default function RoomPage() {
  const history = useHistory()

  const backHandler = useCallback(() => {
    history.goBack()
  }, [])

  const closeHandler = useCallback(() => {
    history.goBack()
  }, [])

  return (
    <div className="wrapper">
      <div className="room-page">
        <header className="room-header">
          <a className="room-back-button" onClick={backHandler}>
            &lt;
          </a>
          <div className="room-title">Title</div>
          <a className="room-close-button" onClick={closeHandler}>
            종료
          </a>
        </header>

        <div className="room-messages">
          <div className="message-bubble">
            <div className="message-user">상병 김용빈</div>
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
              <div className="message-time">16:30</div>
            </div>
          </div>
          <div className="message-bubble is-mine">
            <div className="message-user">상병 김용빈</div>
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
              <div className="message-time">16:30</div>
            </div>
          </div>
          <div className="message-bubble">
            <div className="message-user">상병 김용빈</div>
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
            </div>
          </div>
          <div className="message-bubble">
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
            </div>
          </div>
          <div className="message-bubble">
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
              <div className="message-time">16:30</div>
            </div>
          </div>
          <div className="message-bubble is-mine">
            <div className="message-user">상병 김용빈</div>
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
            </div>
          </div>
          <div className="message-bubble is-mine">
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
            </div>
          </div>
          <div className="message-bubble is-mine">
            <div className="message-content">
              <div className="message-body">Hello, World!</div>
              <div className="message-time">16:30</div>
            </div>
          </div>
        </div>

        <div className="room-notes"></div>

        <div className="field has-addons room-input">
          <div className="control is-expanded">
            <input type="text" className="input is-radiusless" />
          </div>
          <div className="control">
            <a className="button is-primary is-radiusless">보내기</a>
          </div>
        </div>
      </div>
    </div>
  )
}
