import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface DescribeRoomRequest {
  room_id: number
}

export interface DescribeRoomResponseUser {
  id: number
  rank: string
  name: string
}

export interface DescribeRoomResponse {
  group_id: number
  is_counselor: boolean
  users: DescribeRoomResponseUser[]
}

export function describeRoom(
  req: DescribeRoomRequest,
  token: string,
  dispatch: AsyncDispatch<DescribeRoomResponse>
) {
  handleAPI(dispatch, () => {
    return post(`/api/describe_room`, req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
