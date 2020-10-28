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

        <div className="room-messages">Messages</div>

        <div className="room-notes"></div>

        <div className="room-inputs">
          <input type="text" className="input" />
          <a className="room-send-button">보내기</a>
        </div>
      </div>
    </div>
  )
}
