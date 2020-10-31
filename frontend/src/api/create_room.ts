import { AsyncDispatch } from '../hooks/async'
import { handleAPI } from './api'
import { post } from '../utils/http'

export interface CreateRoomRequest {
  group_id: number
  counselor_id: number
}

export interface CreateRoomResponse {
  room_id: number
}

export function createRoom(
  req: CreateRoomRequest,
  token: string,
  dispatch: AsyncDispatch<CreateRoomResponse>
) {
  handleAPI(dispatch, () => {
    return post('/api/create_room', req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}

