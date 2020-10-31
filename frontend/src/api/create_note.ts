import { AsyncDispatch } from '../hooks/async'
import { handleAPI } from './api'
import { post } from '../utils/http'

export interface CreateNoteRequest {
  group_id: number
  room_id: number
  content: string
}

export interface CreateNoteResponse {
  note_id: string
}

export function createNote(
  req: CreateNoteRequest,
  token: string,
  dispatch: AsyncDispatch<CreateNoteResponse>
) {
  handleAPI(dispatch, () => {
    return post('/api/create_note', req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
