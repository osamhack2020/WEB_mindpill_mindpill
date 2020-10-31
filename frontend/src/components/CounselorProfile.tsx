import React, {
  useEffect,
  useState,
  useCallback
} from 'react'
import { useHistory } from 'react-router-dom'
import { useTrackedState } from '../state'
import {
  describeUser,
  DescribeUserResponse
} from '../api/describe_user'
import {
  createRoom,
  CreateRoomResponse
} from '../api/create_room'
import { useAsyncReducer } from '../hooks/async'
import { useAPI } from '../hooks/api'
import { GroupNoteList } from './NoteList'

export interface CounselorProfileProps {
  counselorID: number
  groupID: number
  isCounselor: boolean
  isManager: boolean
}

export function CounselorProfile({
  counselorID,
  groupID,
  isCounselor,
  isManager
}: CounselorProfileProps) {
  const [user, counselorDispatch] = useAPI<
    DescribeUserResponse
  >()

  useEffect(() => {
    describeUser(counselorID, counselorDispatch)
  }, [])

  return (
    <>
      {user != null && (
        <div className="counselor-profile">
          <div className="profile-header">
            <p className="profile-name">
              {user.name} 상담관
            </p>
            <p className="profile-call">
              {user.phone_number}
            </p>
          </div>
          {isCounselor || isManager ? (
            <div className="counselor-notes">
              <GroupNoteList
                counselorID={counselorID}
                groupID={groupID}
              />
            </div>
          ) : (
            <div className="profile-footer">
              <CreateRoomButton
                counselorID={counselorID}
                groupID={groupID}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

interface CreateRoomButtonProps {
  groupID: number
  counselorID: number
}

function CreateRoomButton({
  groupID,
  counselorID
}: CreateRoomButtonProps) {
  const history = useHistory()
  const state = useTrackedState()
  const [roomResponse, roomDispatch] = useAPI<
    CreateRoomResponse
  >()

  const clickHandler = useCallback(() => {
    const { token } = state
    if (token != null) {
      createRoom(
        {
          group_id: groupID,
          counselor_id: counselorID
        },
        token.access,
        roomDispatch
      )
    }
  }, [state])

  useEffect(() => {
    if (roomResponse != null) {
      history.push(`/room/${roomResponse.room_id}`)
    }
  }, [roomResponse])

  return (
    <a
      className="button create-room is-primary is-radiusless"
      onClick={clickHandler}>
      상담하기
    </a>
  )
}
