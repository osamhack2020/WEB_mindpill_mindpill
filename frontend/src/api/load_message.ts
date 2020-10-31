import JSBI from 'jsbi'
import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface LoadMessageRequest {
  room_id: number
  timestamp: string
}

export interface LoadMessageResponse {
  message: string
  timestamp: string
}

export function loadMessage(
  req: LoadMessageRequest,
  token: string,
  dispatch: AsyncDispatch<LoadMessageResponse>
) {
  handleAPI(dispatch, () => {
    return post(`/api/load_message`, req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
