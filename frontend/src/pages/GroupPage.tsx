import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { describeGroup, DescribeGroupResponse } from '../api/describe_group'
import { CounselorProfile } from '../components/CounselorProfile'
import Layout from '../components/Layout'
import { useAsyncReducer } from '../hooks/async'
import { useTrackedState } from '../state'

interface GroupPageMatch {
  id: string
}

export default function GroupPage({
  match
}: RouteComponentProps<GroupPageMatch>) {
  const state = useTrackedState()
  const [groupID, setGroupID] = useState(0)
  const [groupState, groupDispatch] = useAsyncReducer<DescribeGroupResponse>()
  const [group, setGroup] = useState<DescribeGroupResponse | null>(null)

  useEffect(() => {
    const groupID = parseInt(match.params.id)
    setGroupID(groupID)
  }, [match])

  useEffect(() => {
    const token = state.token == null ? null : state.token.access
    if (groupID > 0) {
      describeGroup(groupID, token, groupDispatch)
    }
  }, [state, groupID])

  useEffect(() => {
    if (groupState.data != null) {
      setGroup(groupState.data)
    }
  }, [groupState])

  return (
    <Layout>
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
    </Layout>
  )
}
