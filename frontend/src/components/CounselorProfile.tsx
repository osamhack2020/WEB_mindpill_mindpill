import React, { useEffect, useState } from 'react'
import { describeUser, DescribeUserResponse } from '../api/describe_user'
import { useAsyncReducer } from '../hooks/async'
import { NoteList } from './NoteList'

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
  const [counselorState, counselorDispatch] = useAsyncReducer<
    DescribeUserResponse
  >()

  const [user, setUser] = useState<DescribeUserResponse | null>(null)

  useEffect(() => {
    describeUser(counselorID, counselorDispatch)
  }, [])

  useEffect(() => {
    if (counselorState.data != null) {
      setUser(counselorState.data)
    }
  }, [counselorState])

  return (
    <>
      {user != null && (
        <div className="counselor-profile">
          <div className="profile-header">
            <p className="profile-name">{user.name}</p>
            <p className="profile-call">{user.phone_number}</p>
          </div>
          {isCounselor || isManager ? (
            <div className="counselor-notes">
              <NoteList counselorID={counselorID} groupID={groupID} />
            </div>
          ) : (
            <div className="profile-footer">
              <a className="button">상담하기</a>
            </div>
          )}
        </div>
      )}
    </>
  )
}
