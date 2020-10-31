import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface ListNotesFromRoomRequest {
  room_id: number
}

export interface ListNotesFromRoomResponse {
  notes: Array<{ content: string }>
}

export function listNotesFromRoom(
  req: ListNotesFromRoomRequest,
  token: string,
  dispatch: AsyncDispatch<ListNotesFromRoomResponse>
) {
  handleAPI(dispatch, () => {
    return post(`/api/list_notes_from_room`, req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
