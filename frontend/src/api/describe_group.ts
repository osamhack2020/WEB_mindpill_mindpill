import { AsyncDispatch } from '../hooks/async'
import { get } from '../utils/http'
import { handleAPI } from './api'

export interface DescribeGroupResponse {
  name: string
  counselors: number[]
  created_at: string
  updated_at: string

  is_counselor: boolean
  is_manager: boolean
}

export function describeGroup(
  groupID: number,
  token: string | null,
  dispatch: AsyncDispatch<DescribeGroupResponse>
) {
  handleAPI(dispatch, () => {
    return get(`/api/describe_group?group_id=${groupID}`, {
      headers: {
        Authorization: token != null ? `Bearer ${token}` : undefined
      }
    })
  })
}
