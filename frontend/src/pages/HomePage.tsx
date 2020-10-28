import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { AsyncDispatch, useAsyncReducer } from '../hooks/async'
import { useAPI } from '../hooks/api'
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

  const [groupResponse, groupDispatch] = useAPI<ListMyGroupResponse>()

  useEffect(() => {
    const { token } = state
    if (token != null) {
      listMyGroup(token.access, groupDispatch)
    }
  }, [state])

  return (
    <Layout>
      <div className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              국군 상담 플랫폼
            </h1>
            <h2 className="subtitle">
              대한민국 국군 장병들을 위한 상담 플랫폼, 마인드필입니다.
            </h2>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          {groupResponse != null && (
            <>
              <h2 className="title is-4">내 그룹</h2>
              <div className="groups">
                {groupResponse.groups.map(group => (
                  <Link to={`/group/${group.id}`} className="group-item">
                    {group.name}
                  </Link>
                ))}
                {groupResponse.counselor_groups.map(group => (
                  <Link to={`/group/${group.id}`} className="group-item is-counselor">
                    [상담관] {group.name}
                  </Link>
                ))}
                {groupResponse.manager_groups.map(group => (
                  <Link to={`/group/${group.id}`} className="group-item is-manager">
                    [매니저] {group.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
