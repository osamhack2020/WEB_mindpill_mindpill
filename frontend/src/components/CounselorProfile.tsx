import React, { useEffect, useState } from 'react'
import { describeUser, DescribeUserResponse } from '../api/describe_user'
import { useAsyncReducer } from '../hooks/async'
import { useAPI } from '../hooks/api'
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
            <p className="profile-name">{user.name} 상담관</p>
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
