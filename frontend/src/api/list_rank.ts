import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface ListRankResponse {
  ranks: Array<{ id: number; name: string }>
}

export function listRank(dispatch: AsyncDispatch<ListRankResponse>) {
  handleAPI(dispatch, () => {
    return post(`/api/list_rank`)
  })
}
