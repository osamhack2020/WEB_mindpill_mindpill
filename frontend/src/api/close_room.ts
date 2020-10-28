import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface CloseRoomRequest {
  room_id: number
}

export function describeGroup(
  req: CloseRoomRequest,
  token: string,
  dispatch: AsyncDispatch<{}>
) {
  handleAPI(dispatch, () => {
    return post('/api/close_room', req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
