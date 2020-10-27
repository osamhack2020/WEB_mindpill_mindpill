import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface ListNotesFromCounselorRequest {
  group_id: number
  counselor_id: number
}

export interface ListNotesFromCounselorResponse {
  notes: Array<{ content: string }>
}

export function listNotesFromCounselor(
  req: ListNotesFromCounselorRequest,
  token: string,
  dispatch: AsyncDispatch<ListNotesFromCounselorResponse>
) {
  handleAPI(dispatch, () => {
    return post(`/api/list_notes_from_counselor`, req, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
}
