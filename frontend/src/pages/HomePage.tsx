import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { AsyncDispatch, useAsyncReducer } from '../hooks/async'
import { useTrackedState } from '../state'
import { ListMyGroupResponse } from '../types/api/list_my_group'
import { get } from '../utils/http'

async function listMyGroup(
  token: string,
  dispatch: AsyncDispatch<ListMyGroupResponse>
) {
  dispatch({ type: 'LOADING' })

  const response = await get<ListMyGroupResponse>('/api/list_my_group', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
    return
  }

  dispatch({ type: 'SUCCESS', data: response.data })
  return response.data
}

export default function Home() {
  const state = useTrackedState()
  const [groupState, groupDispatch] = useAsyncReducer<ListMyGroupResponse>()

  useEffect(() => {
    const { token } = state
    if (token != null) {
      listMyGroup(token.access, groupDispatch)
    }
  }, [state])

  return (
    <Layout>
      <div className="section is-homepage">
        {groupState.data != null ? (
          <div className="groups">
            {groupState.data.groups.map(group => (
              <Link to={`/groups/${group.id}`} className="group">
                {group.name}
              </Link>
            ))}
            {groupState.data.counselor_groups.map(group => (
              <Link to={`/groups/${group.id}`} className="group is-counselor">
                [상담관] {group.name}
              </Link>
            ))}
            {groupState.data.manager_groups.map(group => (
              <Link to={`/groups/${group.id}`} className="group is-manager">
                [매니저] {group.name}
              </Link>
            ))}
          </div>
        ) : (
          ''
        )}
        <div>Home</div>
      </div>
    </Layout>
  )
}
