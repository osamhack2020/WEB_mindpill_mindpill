import React, {
  useCallback,
  useEffect,
  useState,
  useMemo
} from 'react'
import { RouteComponentProps } from 'react-router'
import { useHistory } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom'
import { RoomNoteList } from '../components/NoteList'
import { useTrackedState } from '../state'
import { closeRoom } from '../api/close_room'
import { useAPI } from '../hooks/api'

interface RoomPageMatch {
  id: string
}

export default function RoomPage({
  match
}: RouteComponentProps<RoomPageMatch>) {
  const { token } = useTrackedState()
  const history = useHistory()
  const roomID = useMemo(() => parseInt(match.params.id), [
    match
  ])
  const [
    closeRoomResponse,
    closeRoomDispatch
  ] = useAPI<{}>()
  const [isActive, setActive] = useState(true)

  const backHandler = useCallback(() => {
    history.goBack()
  }, [])

  const closeHandler = useCallback(() => {
    if (token != null) {
      setActive(false)
      closeRoom(
        { room_id: roomID },
        token.access,
        closeRoomDispatch
      )
    }
  }, [token])

  useEffect(() => {
    if (closeRoomResponse != null) {
      history.goBack()
    }
  }, [closeRoomResponse])

  return (
    <div className="wrapper">
      <div className="room-page">
        <header className="room-header">
          <a
            className="room-back-button"
            onClick={backHandler}>
            &lt;
          </a>
          <div className="room-title">상담</div>
          <a
            className="room-close-button"
            onClick={closeHandler}>
            종료
          </a>
        </header>
        {token != null && (
          <ChatRoom
            roomID={roomID}
            token={token.access}
            active={isActive}
          />
        )}
      </div>
    </div>
  )
}
