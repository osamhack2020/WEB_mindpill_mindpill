import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface ListMyRoomRequest {
  group_id: number
}

export interface ListMyRoomResponseUser {
  rank: string
  name: string
}

export interface ListMyRoomResponseRoom {
  id: number
  users: ListMyRoomResponseUser[]
}

export interface ListMyRoomResponse {
  rooms: ListMyRoomResponseRoom[]
}

export function listMyRoom(
  req: ListMyRoomRequest,
  token: string,
  dispatch: AsyncDispatch<ListMyRoomResponse>
) {
  handleAPI(dispatch, () => {
    return post('/api/list_my_room', req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
