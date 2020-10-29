import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { describeGroup, DescribeGroupResponse } from '../api/describe_group'
import { listMyRoom, ListMyRoomResponse } from '../api/list_my_room'
import { CounselorProfile } from '../components/CounselorProfile'
import Layout from '../components/Layout'
import { useAsyncReducer } from '../hooks/async'
import { useAPI } from '../hooks/api'
import { useTrackedState } from '../state'

interface GroupPageMatch {
  id: string
}

export default function GroupPage({
  match
}: RouteComponentProps<GroupPageMatch>) {
  const state = useTrackedState()

  const [groupID, setGroupID] = useState(0)
  const [group, groupDispatch] = useAPI<DescribeGroupResponse>()
  const [roomResponse, roomDispatch] = useAPI<ListMyRoomResponse>()

  useEffect(() => {
    const groupID = parseInt(match.params.id)
    setGroupID(groupID)
  }, [match])

  useEffect(() => {
    const token = state.token == null ? null : state.token.access
    if (groupID > 0) {
      describeGroup(groupID, token, groupDispatch)
    }
    if (groupID > 0 && token != null) {
      listMyRoom({ group_id: groupID }, token, roomDispatch)
    }
  }, [state, groupID])

  return (
    <Layout>
      <div className="section">
        <div className="container">
          {group != null ? (
            <div>
              <h1 className="title">{group.name}</h1>

              {roomResponse != null && (
                <>
                  <h2 className="title is-4">진행중인 상담</h2>
                  <div className="room-list">
                    {roomResponse.rooms.map(room => (
                      <Link to={`/room/${room.id}`} className="room-item">
                        {room.users.map(user => (
                          <span>
                            {user.rank} {user.name}
                          </span>
                        ))}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <h2 className="title is-4">상담관 목록</h2>
              <div className="counselor-list">
                {group != null &&
                  group.counselors.map(counselorID => (
                    <CounselorProfile
                      counselorID={counselorID}
                      groupID={groupID}
                      isCounselor={group.is_counselor}
                      isManager={group.is_manager}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
    </Layout>
  )
}

